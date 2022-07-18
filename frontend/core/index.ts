import type { Component } from 'vue-demi';
import type { Options, Hook } from '@/core/types/vue';

export async function createVueApp(App: Component, options: Options, hook: Hook) {
  const isClient = typeof window !== 'undefined';

  if (!isClient) {
    const server = await import('@/core/vue/entry-server');
    return server.default(App, options, hook);
  }

  const client = await import('@/core/vue/entry-client');
  return await client.default(App, options, hook);
}
