import { openSync, writeFileSync } from 'fs';
/* eslint-disable */
import { resolveDistPath } from '../server/utils/resolve-path.js';
import { FILE_CLIENT_PAGES } from '../server/constants/files.js';
import { getClientRoutes } from '../server/utils/client.js';
/* eslint-enable */

openSync(resolveDistPath(FILE_CLIENT_PAGES), 'w');
writeFileSync(resolveDistPath(FILE_CLIENT_PAGES), String([...getClientRoutes()]));
