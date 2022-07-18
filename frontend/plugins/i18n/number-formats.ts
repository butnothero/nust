import { SUPPORTED_LOCALES } from './locales';

const DEFAULT_FORMAT = {
  USD: {
    style: 'currency',
    currency: 'USD',
  },
  RUB: {
    style: 'currency',
    currency: 'RUB',
  },
  decimal: {
    style: 'decimal',
  },
};

export const NUMBER_FORMATS = Object.freeze({
  ...SUPPORTED_LOCALES.reduce((acc, l) => ({ ...acc, [l]: DEFAULT_FORMAT }), {}),
  // Overwrite formats here for specific locales
});
