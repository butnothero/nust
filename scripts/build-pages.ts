import { openSync, writeFileSync } from 'fs';
/* eslint-disable */
import { resolveDistPath } from '../backend/utils/resolve-path';
import { FILE_CLIENT_PAGES } from '../backend/constants/files';
import { getClientRoutes } from '../backend/utils/client';
/* eslint-enable */

openSync(resolveDistPath(FILE_CLIENT_PAGES), 'w');
writeFileSync(resolveDistPath(FILE_CLIENT_PAGES), String([...getClientRoutes()]));
