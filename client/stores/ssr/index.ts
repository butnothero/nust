/**
 * Данное хранилище используется только при SSR.
 * При отправке HTML пользователю, данные из этого хранилища не используются в гидратации состояния.
 */
export const useSSRStore = defineStore('ssrOnly', {
  state: () => ({}),

  getters: {},

  actions: {},
});
