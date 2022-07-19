import { readFileSync } from 'fs';
import { resolveDistPath } from './resolve-path.js';

let render: any;
let template: string;
let manifest: any;

export const getRender = () => render;
export const getTemplate = () => template;
export const getManifest = () => manifest;

const loadRender = async () => {
  try {
    render = (await import(`file://${resolveDistPath('backend', 'entry-server.js')}`)).render;
  } catch (e) {
    console.error('Ошибка загрузки функции рендера', e);
  }
};

const loadTemplate = () => {
  try {
    template = readFileSync(resolveDistPath('frontend', 'index.html'), {
      encoding: 'utf-8',
    });
  } catch (e) {
    console.error('Ошибка загрузки шаблона', e);
  }
};

const loadManifest = () => {
  try {
    manifest = JSON.parse(
      readFileSync(resolveDistPath('frontend', 'ssr-manifest.json'), {
        encoding: 'utf-8',
      }),
    );
  } catch (e) {
    console.error('Ошибка загрузки манифеста', e);
  }
};

export const initProductionClient = async (): Promise<boolean> => {
  if (
    typeof render !== 'undefined' &&
    typeof template !== 'undefined' &&
    typeof manifest !== 'undefined'
  )
    return false;
  console.log('Инициализация клиентской части...');
  await loadRender();
  loadTemplate();
  loadManifest();
  console.log('Клиентская часть успешно инициализированна!');
  return true;
};
