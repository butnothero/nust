import { fileURLToPath, URL } from 'url';
import { resolve, join } from 'path';
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import vueJsx from '@vitejs/plugin-vue-jsx';
import WindiCSS from 'vite-plugin-windicss';
import Pages from 'vite-plugin-pages';
import Layouts from 'vite-plugin-vue-layouts';
import Components from 'unplugin-vue-components/vite';
import AutoImport from 'unplugin-auto-import/vite';
import Inspect from 'vite-plugin-inspect';
import { viteCommonjs, esbuildCommonjs } from '@originjs/vite-plugin-commonjs/lib/index.js';
// import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  publicDir: resolve(__dirname, 'client', 'static'),
  base: '/',
  build: {
    target: 'modules',
    // outDir: join(__dirname, 'dist'),
    assetsInlineLimit: 10000,
    sourcemap: true,
  },
  plugins: [
    // viteCommonjs(),

    vue({
      include: [/\.vue$/],
      // template: {
      //   compilerOptions: {
      //     isCustomElement: (tag) => tag.startsWith('client') || tag.startsWith('Client'),
      //   },
      // },
    }),

    vueJsx(),

    WindiCSS(),

    Pages({
      extensions: ['vue'],
      exclude: ['**/components/*.vue', '**/modules/*.ts'],
      dirs: ['./client/pages'],
    }),

    Layouts({
      layoutsDirs: './client/layouts',
    }),

    AutoImport({
      imports: [
        'vue',
        'vue-router',
        '@vueuse/head',
        '@vueuse/core',
        'pinia',
        'vue-i18n',
        {
          axios: [
            // default imports
            ['default', 'axios'], // import { default as axios } from 'axios',
          ],
        },
      ],

      dts: 'client/auto-imports.d.ts',
    }),

    Components({
      // allow auto load markdown components under `./src/components/`
      extensions: ['vue'],

      // allow auto import and register components used in markdown
      include: [/\.vue$/, /\.vue\?vue/],

      directoryAsNamespace: true,

      // custom resolvers
      resolvers: [],

      dts: 'client/components.d.ts',

      dirs: ['./client/components'],
    }),

    Inspect({
      // change this to enable inspect for debugging
      enabled: false,
    }),
  ],
  resolve: {
    alias: {
      // @ts-ignore
      '@': fileURLToPath(new URL('client', import.meta.url)),
      // @ts-ignore
      '@backend': fileURLToPath(new URL('server', import.meta.url)),
      // @ts-ignore
      '@root': fileURLToPath(new URL('./', import.meta.url)),
    },
  },
  define: {
    __VUE_I18N_FULL_INSTALL__: true,
    __VUE_I18N_LEGACY_API__: false,
    __INTLIFY_PROD_DEVTOOLS__: false,
  },
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `
          @import "@/assets/design-system/index.scss";
          @import "@/assets/vendors/index.scss";
        `,
        sourceMap: true,
        charset: false,
      },
      sass: { charset: false },
    },
  },
  optimizeDeps: {
    include: [
      'vue',
      'vue-router',
      '@vueuse/core',
      '@vueuse/head',
      'pinia',
      'lodash',
      '@vueuse/integrations/useCookies',
      'axios',
    ],
    exclude: ['vue-demi'],
  },
});
