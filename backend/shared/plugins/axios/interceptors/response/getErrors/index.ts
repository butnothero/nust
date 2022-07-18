import type { AxiosError } from 'axios';

export const createResGetErrors = (error: AxiosError) => error?.response;
