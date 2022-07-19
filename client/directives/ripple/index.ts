import { App } from 'vue';
import { rippleEffect } from '@/directives/ripple/helpers';

export const vueEffectRipple = (app: App) => {
  app.directive('ripple-out', {
    beforeMount(el, binding, vnode) {
      el.onclick = (e) => {
        rippleEffect(e, el, 'ripple-out');
      };
    },
  });

  app.directive('ripple-in', {
    beforeMount(el, binding, vnode) {
      el.onclick = (e) => {
        rippleEffect(e, el, 'ripple-in');
      };
    },
  });
};
