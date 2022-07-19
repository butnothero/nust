import { defineMiddleware } from '@/core/middlewares';

export default defineMiddleware('hello', async ({}) => {
  console.log('hello middleware');

  return true;
});
