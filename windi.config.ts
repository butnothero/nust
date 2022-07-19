import { defineConfig } from 'windicss/helpers';

export default defineConfig({
  preflight: false,
  extract: {
    include: ['frontend/**/*.{vue,html,jsx,tsx,ts,js}'],
    exclude: ['node_modules', '.git'],
  },
  // https://windicss.org/posts/v30.html#attributify-mode
  attributify: {
    prefix: 'w',
  },
  purge: ['./index.html', './frontend/**/*.{vue,js,ts,jsx,tsx}'],
  theme: {
    extend: {
      screens: {
        // Ширина экрана, при которой начинается обработка hover состояния
        'w-hover': '100px',
      },
      textColor: {},
      backgroundColor: {},
      boxShadow: {},
    },
  },
  variants: {
    scrollbar: ['rounded'],
  },
  shortcuts: {
    // Padding
    'box-pl': 'pl-16px',
    'box-pr': 'pr-16px',
    'box-pt': 'pt-16px',
    'box-pb': 'pb-16px',
    'box-px': 'box-pl box-pr',
    'box-py': 'box-pt box-pb',
    'box-p': 'box-px box-py',

    // Margin
    'box-ml': 'ml-16px',
    'box-mr': 'mr-16px',
    'box-mt': 'mt-16px',
    'box-mb': 'mb-16px',
    'box-mx': 'box-ml box-mr',
    'box-my': 'box-mt box-mb',
    'box-m': 'box-mx box-my',

    // Max-width
    'box-max-w-xs': 'max-w-250px',
    'box-max-w-s': 'max-w-350px',
    'box-max-w-m': 'max-w-500px',
    'box-max-w-l': 'max-w-750px',
    'box-max-w-xl': 'max-w-900px',
    'box-max-w-xxl': 'max-w-1200px',

    // Scrollbars
    'scrollbar-default':
      'scrollbar-thin scrollbar-thumb-gray-500 scrollbar-thumb-rounded scrollbar-track-transparent',

    // Containers
    'container-px': 'relative box-px',
    'container-mx': 'relative box-mx',

    // Flex
    'flex-c-b': 'flex items-center justify-between',
    'flex-c-e': 'flex items-center justify-end',
    'flex-c-c': 'flex items-center justify-center',
    'flex-c': 'flex items-center',
    'flex-e': 'flex items-end',

    // Position absolute
    'absolute-x-c': 'absolute transform -translate-x-1/2 left-1/2',
    'absolute-y-c': 'absolute transform -translate-y-1/2 top-1/2',
    'absolute-c-c': 'absolute-x-c absolute-y-c',

    // Icon sizes
    'icon-size': 'w-25px h-25px',

    // Text
    'text-break': 'overflow-hidden break-words',
  },
});
