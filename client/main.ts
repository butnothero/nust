// Virtual
import 'virtual:windi.css';

// Custom styles
import '@/assets/scss/index.scss';
import '@/assets/scss/vendors/nprogress/index.scss';

import { createHead } from '@vueuse/head';
import mitt from 'mitt';
import devalue from '@nuxt/devalue';
import generatedRoutes from 'virtual:generated-pages';
import { setupLayouts } from 'virtual:generated-layouts';
import { cookiesNames } from '@/enums/cookiesNames';
import App from './App.vue';
import { installVueDirectives } from '@/directives';
import { createVueApp } from '@/core';
import type { Options } from '@/core/types/vue';
import { installI18n, extractLocaleFromPath, DEFAULT_LOCALE } from '@/plugins/i18n';
import { Middleware, middlewareHandler } from '@/core/middlewares';

const options: Options = {
  routes: setupLayouts(generatedRoutes),
  pageProps: {
    passToPage: false,
  },
  transformState(state) {
    return import.meta.env.SSR ? devalue(state) : state;
  },
  routerOptions: {
    scrollBehavior(to, from, savedPosition) {
      if (savedPosition) {
        return savedPosition;
      }
      return { top: 0 };
    },
  },
};

export default createVueApp(App, options, async (ctx) => {
  const { app, router, initialState, isClient, initialRoute, request } = ctx;

  // ------- INSTALL MODULES -------
  // @ts-ignore
  Object.values(import.meta.globEager('./modules/*.ts')).map(async (i) => await i.install?.(ctx));
  // -------------------------------

  // ------- INSTALL HEAD -------
  const head = createHead();
  app.use(head);
  // ----------------------------

  // ------- GLOBAL SETTINGS -------
  app.config.globalProperties.emitter = mitt();
  app.config.unwrapInjectedRef = true;
  // -------------------------------

  // ------- INSTALL i18n -------
  let locale = 'ru';
  if (!isClient) {
    const cookiesLocale = request.cookies[cookiesNames.app.locale] || '';
    if (cookiesLocale) {
      initialState[cookiesNames.app.locale] = cookiesLocale;
      locale = cookiesLocale;
    }
  } else {
    const stateLocale = initialState[cookiesNames.app.locale] || '';
    if (stateLocale) {
      locale = stateLocale;
    }
  }
  await installI18n(app, locale);
  // -----------------------------------

  // ---------------- INSTALLS ----------------
  installVueDirectives(app);
  // ------------------------------------------

  // ------- IMPORT MIDDLEWARES -------
  const middlewareGlob = import.meta.globEager('./middlewares/*.ts');
  const middlewares: Middleware[] = Object.keys(middlewareGlob).map(
    // @ts-ignore
    (key) => middlewareGlob[key].default,
  );
  const handler = middlewareHandler(ctx, middlewares);
  router.beforeEach(handler);
  // ---------------------------------

  return {
    head,
  };
});
