import { NestFactory } from '@nestjs/core';
import compression from 'compression';
import type { NestExpressApplication } from '@nestjs/platform-express';
import cookieParser from 'cookie-parser';
import os from 'os';
import { AppModule } from './app.module';
import { getViteServer } from './get-vite-server';
import { isProduction } from './utils/env';
import { resolveDistPath } from './utils/resolve-path';

import { HttpExceptionFilter } from './http-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, { logger: false });

  const port = process.env.PORT || 3333;

  const networkInterfaces = os.networkInterfaces();
  const networkInterfacesArr = [].concat(...Object.values(networkInterfaces));

  app.use(cookieParser());
  app.useGlobalFilters(new HttpExceptionFilter());

  if (isProduction) {
    app.useStaticAssets(resolveDistPath('frontend'), {
      index: false,
    });
    app.use(compression());
  } else {
    const vite = await getViteServer();
    app.use(vite.middlewares);
  }

  console.log(`=================================`);
  console.log(`======= ENV: ${process.env.NODE_ENV} =======`);
  console.log(`Local: http://localhost:${port}`);
  networkInterfacesArr.forEach((netInterface) => {
    if (netInterface?.family === 'IPv4') {
      console.log(`Network: http://${netInterface.address}:${port}`);
    }
  });
  console.log(`=================================`);

  await app.listen(port);
}

bootstrap();
