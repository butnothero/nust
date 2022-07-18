import { copyFileSync } from 'fs';
/* eslint-disable */
import { resolveClientPath } from '../backend/utils/resolve-path';
/* eslint-enable */

copyFileSync(resolveClientPath('index.html'), './index.html');
