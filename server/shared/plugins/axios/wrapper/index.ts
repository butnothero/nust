import { cloneDeep, flow } from 'lodash';
import axios, { AxiosInstance, AxiosRequestConfig, CancelTokenSource } from 'axios';
import type {
  ApiMethodParams,
  CollectedRequestInfo,
  CollectorOptions,
  AxiosWrapperOptions,
  RequestInfoToCollect,
  Interceptors,
} from '@server/shared/plugins/axios/wrapper/types';
import { ApiMethodParamsOptions } from '@server/shared/plugins/axios/wrapper/types';

export type {
  ApiMethodParams,
  AxiosWrapperOptions,
} from '@server/shared/plugins/axios/wrapper/types';

export default class AxiosWrapper {
  static DEFAULT_TIMEOUT = 30 * 1000;

  protected readonly _axios: AxiosInstance;

  protected readonly requestTokens: Record<string, CancelTokenSource>;

  protected readonly collectorSettings: CollectorOptions;

  protected readonly collector: {
    errors: CollectedRequestInfo[];
    requests: CollectedRequestInfo[];
  };

  protected apiEndpoint?: string;

  constructor(
    options: AxiosWrapperOptions = {},
    interceptors: Interceptors | undefined = undefined,
  ) {
    const { config = {}, apiEndpoint = '', collector = {} } = options;

    const axiosConfig: AxiosRequestConfig = {
      timeout: AxiosWrapper.DEFAULT_TIMEOUT,
      ...config,
    };

    this._axios = axios.create(axiosConfig);

    if (interceptors !== undefined) {
      if (typeof interceptors?.request !== 'undefined') {
        if (typeof interceptors?.request?.success !== 'undefined') {
          this._axios.interceptors.request.use(flow(interceptors.request.success));
        }
        if (typeof interceptors?.request?.error !== 'undefined') {
          this._axios.interceptors.request.use(undefined, flow(interceptors.request.error));
        }
      }

      if (typeof interceptors?.response !== 'undefined') {
        if (typeof interceptors?.response?.success !== 'undefined') {
          this._axios.interceptors.response.use(flow(interceptors.response.success));
        }
        if (typeof interceptors?.response?.error !== 'undefined') {
          this._axios.interceptors.response.use(undefined, flow(interceptors.response.error));
        }
      }
    }

    this._axios.defaults.headers = cloneDeep(this._axios.defaults.headers);
    this.requestTokens = {};
    this.setApiEndpoint(apiEndpoint);
    this.collectorSettings = collector;
    this.collector = {
      errors: [],
      requests: [],
    };
  }

  setApiEndpoint = (endpoint = '') => {
    let preparedEndpoint = endpoint;

    if (typeof location !== 'undefined') {
      preparedEndpoint = preparedEndpoint.replace('%CURRENT_HOST%', location.host);
    }

    this.apiEndpoint = preparedEndpoint;
  };

  setCSRFToken = (token: string) => {
    this._axios.defaults.headers.post['X-CSRF-Token'] = token;
    this._axios.defaults.headers.put['X-CSRF-Token'] = token;
    this._axios.defaults.headers.delete['X-CSRF-Token'] = token;
  };

  setDefaultHeader = ({
    name,
    value,
    methods,
  }: {
    name: string;
    value: string;
    methods?: string[];
  }) => {
    const { headers } = this._axios.defaults;
    if (Array.isArray(methods)) {
      methods.forEach((method) => {
        if (headers[method]) {
          headers[method][name] = value;
        }
      });
    } else {
      headers.common[name] = value;
    }
  };

  collectRequest({
    method,
    url,
    data,
    requestStart,
    response,
    responseError,
    error = false,
    cancelled = false,
  }: RequestInfoToCollect) {
    const { collectErrors, collectRequests } = this.collectorSettings;
    if (!(collectErrors || collectRequests)) {
      return;
    }

    const { responseText = '', responseURL = url } = (response && response.request) || {};
    const errorText = error && responseError instanceof Error ? responseError.message : '';
    const request: CollectedRequestInfo = {
      method,
      url: responseURL,
      time: {
        start: requestStart,
        end: Number(new Date()),
      },
      status: response && response.status,
      size: responseText.length,
      requestData: (data && JSON.stringify(data, null, 2)) || '',
      responseData:
        (response && response.data && JSON.stringify(response.data, null, 2)) || errorText,
      isError: error,
      isCancelled: cancelled,
    };

    if (collectErrors && error) {
      this.collector.errors = [...this.collector.errors, request].slice(-collectErrors);
    }
    if (collectRequests) {
      this.collector.requests = [...this.collector.requests, request].slice(-collectRequests);
    }
  }

  getCollectedRequests() {
    return {
      errors: [...this.collector.errors],
      requests: [...this.collector.requests],
    };
  }

  async request<T = any>(methodParams: ApiMethodParams): Promise<T> {
    const {
      method,
      url,
      data = null,
      requestConfig = {},
      options = {},
      retries = 0,
    } = methodParams;

    const axiosSettings: AxiosRequestConfig = requestConfig || {};
    const { concurrentId, collectRequest = true } = options;
    if (concurrentId) {
      this.cancelRequest(concurrentId);
      axiosSettings.cancelToken = this.createRequestToken(concurrentId);
    }

    const requestStart = Number(new Date());

    const request = {
      method,
      url,
      data,
    };

    try {
      const response = await this._axios.request<T>({
        ...axiosSettings,
        ...request,
      });

      this.clearRequestToken(concurrentId);
      if (collectRequest) {
        this.collectRequest({
          ...request,
          requestStart,
          response,
        });
      }

      return { ...response.data, httpStatus: response.status };
    } catch (thrown: any) {
      if (axios.isCancel(thrown)) {
        throw { isCancelled: true, error: thrown };
      } else {
        this.clearRequestToken(concurrentId);
      }

      if (collectRequest) {
        this.collectRequest({
          ...request,
          requestStart,
          response: thrown.response,
          error: true,
          cancelled: axios.isCancel(thrown),
          responseError: thrown,
        });
      }

      return this.handleRequestError(
        thrown.response,
        () => this.request({ ...methodParams, retries: retries + 1 }),
        retries,
        new Error(thrown instanceof Error ? thrown.message : 'Unknown error'),
      ) as Promise<T>;
    }
  }

  cancelRequest(id?: string) {
    if (id && this.requestTokens[id]) {
      this.requestTokens[id].cancel('Concurrent request');
    }
  }

  get<T = any>(
    url: string,
    requestConfig: AxiosRequestConfig = {},
    options: ApiMethodParamsOptions = {},
  ) {
    return this.request<T>({
      method: 'GET',
      url,
      requestConfig,
      options,
    });
  }

  post<T = any>(
    url: string,
    data: unknown = undefined,
    requestConfig: AxiosRequestConfig = {},
    options: ApiMethodParamsOptions = {},
  ) {
    return this.request<T>({
      method: 'POST',
      url,
      data,
      requestConfig,
      options,
    });
  }

  put<T = any>(
    url: string,
    data: unknown = undefined,
    requestConfig: AxiosRequestConfig = {},
    options: ApiMethodParamsOptions = {},
  ) {
    return this.request<T>({
      method: 'PUT',
      url,
      data,
      requestConfig,
      options,
    });
  }

  patch<T = any>(
    url: string,
    data: unknown = undefined,
    requestConfig: AxiosRequestConfig = {},
    options: ApiMethodParamsOptions = {},
  ) {
    return this.request<T>({
      method: 'PATCH',
      url,
      data,
      requestConfig,
      options,
    });
  }

  delete<T = any>(
    url: string,
    data: unknown = undefined,
    requestConfig: AxiosRequestConfig = {},
    options: ApiMethodParamsOptions = {},
  ) {
    return this.request<T>({
      method: 'DELETE',
      url,
      data,
      requestConfig,
      options,
    });
  }

  head<T = any>(
    url: string,
    requestConfig: AxiosRequestConfig = {},
    options: ApiMethodParamsOptions = {},
  ) {
    return this.request<T>({
      method: 'HEAD',
      url,
      requestConfig,
      options,
    });
  }

  apiPath = (path: string) => `${this.apiEndpoint}${path}`;

  protected handleRequestError<T>(
    response: unknown,
    request: () => Promise<T>,
    retries: number,
    error: Error,
  ): Promise<T> | unknown;

  protected handleRequestError(response: unknown) {
    throw response;
  }

  protected createRequestToken(id?: string) {
    if (id) {
      const source = axios.CancelToken.source();
      this.requestTokens[id] = source;
      return source.token;
    }
    return undefined;
  }

  protected clearRequestToken(id?: string) {
    if (id && this.requestTokens[id]) {
      delete this.requestTokens[id];
    }
  }
}
