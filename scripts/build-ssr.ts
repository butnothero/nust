import { execSync } from 'child_process';

execSync('vite build --outDir dist/server --ssr client/entry-server.ts', {
  stdio: 'inherit',
});

// const isWin = process.platform === 'win32';
//
// if (isWin) {
//   execSync('copy ./client/index.html ./client/', { stdio: 'inherit' });
// } else {
//   execSync('mv ./index.html ./client/', { stdio: 'inherit' });
// }
