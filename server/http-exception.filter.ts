import { ArgumentsHost, Catch, ExceptionFilter, HttpException, Req } from '@nestjs/common';
import { ViteDevServer } from 'vite';
import { readFileSync } from 'fs';
import { isProduction } from './utils/env.js';
import { resolveClientPath, resolveDistPath } from './utils/resolve-path.js';
import { getViteServer } from './get-vite-server.js';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  async catch(exception: HttpException, host: ArgumentsHost) {
    if (
      typeof exception === 'undefined' ||
      typeof exception.getStatus === 'undefined' ||
      exception.getStatus() !== 404 ||
      !exception.message.toLowerCase().includes('get')
    )
      return;
    console.error(exception);
    const request = host.switchToHttp().getRequest();
    const url = request.originalUrl;
    let vite: ViteDevServer;
    let template: string;
    let render: any;

    if (isProduction) {
      template = readFileSync(resolveDistPath('client', 'index.html'), {
        encoding: 'utf-8',
      });
      render = (await import(`file://${resolveDistPath('server', 'entry-server.js')}`)).render;
    } else {
      vite = await getViteServer();
      template = await vite.transformIndexHtml(
        url,
        readFileSync(resolveClientPath('index.html'), {
          encoding: 'utf-8',
        }),
      );
      render = (await vite.ssrLoadModule(resolveClientPath('entry-server.ts'))).render;
    }

    const { html } = await render(url, { request, template });

    host.switchToHttp().getResponse().status(exception.getStatus()).send(`${html}`);
  }
}
