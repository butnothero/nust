declare interface Window {
  // extend the window
}

declare module '*.vue' {
  import { DefineComponent, ComponentOptions } from 'vue';
  // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/ban-types
  const component: DefineComponent<{}, {}, any>;
  export default component;
}

// with vite-plugin-md, markdowns can be treat as Vue components
declare module '*.md' {
  const component: ComponentOptions;
  export default component;
}
