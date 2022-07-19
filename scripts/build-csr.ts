import { execSync } from 'child_process';

// const isWin = process.platform === 'win32';
//
// if (isWin) {
//   execSync('COPY ./client/index.html ./index.html', { stdio: 'inherit' });
// } else {
//   execSync('mv ./client/index.html ./', { stdio: 'inherit' });
// }

execSync('vite build --outDir dist/client --ssrManifest', { stdio: 'inherit' });
