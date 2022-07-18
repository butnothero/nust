import createVueApp from './main';

export async function render(url, options) {
  const app = await createVueApp;

  if (typeof app === 'function') {
    // @ts-ignore
    const { html, status, headers, statusText } = await app(url, options);

    return {
      html,
      status,
      headers,
      statusText,
    };
  }

  console.error('app is not a function');

  return {
    html: '',
  };
}
