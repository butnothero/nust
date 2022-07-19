import { copyFileSync } from 'fs';
/* eslint-disable */
import { resolveClientPath } from '../server/utils/resolve-path.js';
/* eslint-enable */

copyFileSync(resolveClientPath('index.html'), './index.html');
