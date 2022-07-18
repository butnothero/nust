import fg from 'fast-glob';
import { join } from 'path';
import { resolveClientPath } from './resolve-path';
import { getIgnore, slash } from './file';

const getPageFiles = () =>
  fg.sync(slash(join(resolveClientPath('pages'), `**/*.vue`)), {
    // ignore: getIgnore(exclude),
    ignore: getIgnore(),
    onlyFiles: true,
  });

export const getClientRoutes = (): string[] => {
  const rootDir = slash(resolveClientPath('pages'));
  const files = getPageFiles().map((file) => slash(file));
  const result: string[] = [];

  files.forEach((file) => {
    const name = file.replace(rootDir, '').replace('.vue', '').slice(1);

    if (name !== '[...pathMatch]') {
      let route = file
        .replace(rootDir, '')
        .replace('index.vue', '')
        .replace('.vue', '')
        .replaceAll('[', ':')
        .replaceAll(']', '');

      if (route.endsWith('/') && route.length > 1) {
        route = route.slice(0, -1);
      }
      result.push(route);
    }
  });

  return [...result];
};
