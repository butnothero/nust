import { createPinia } from 'pinia';
import { UserModule } from '@/root-types';

// Setup Pinia
// https://pinia.esm.dev/
export const install: UserModule = ({ isClient, initialState, app }) => {
  const pinia = createPinia();
  app.use(pinia);
  if (isClient) pinia.state.value = initialState.pinia || {};
  else initialState.pinia = pinia.state.value;
};
