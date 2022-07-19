import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);

const __dirname = dirname(__filename);

/**
 * resolve client file path
 * @param pathSegments relative path of file in client
 * @returns absolute path of file
 */
export const resolveClientPath = (...pathSegments: string[]) =>
  resolve(__dirname, '..', '..', 'frontend', ...pathSegments);

/**
 * resolve dist file path
 * @param pathSegments relative path of file in dist
 * @returns absolute path of file
 */
export const resolveDistPath = (...pathSegments: string[]) =>
  resolve(__dirname, '..', '..', 'dist', ...pathSegments);
