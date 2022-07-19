export const slash = (str: string) => str.replace(/\\/g, '/');

export const getIgnore = (exclude: string[] = []) => [
  'node_modules',
  '.git',
  '**/__*__/**',
  ...exclude,
];
