/**
 * Тот же плагин, что и в menu — отдельный репозиторий = отдельная копия файла.
 * Оба микрофронта подключаются к ОДНОМУ объекту из root через props.
 */
import { ref } from 'vue';
import type { App } from 'vue';
import { defineStore } from 'pinia';

declare module 'pinia' {
  export interface PiniaCustomProperties {
    $centralStore: ReturnType<typeof useCentralStore>;
  }
}

export const useCentralStore = defineStore('central', () => {
  const store = ref<unknown>(null);
  const subscribe = ref<((path: string, callback: (value: unknown) => void) => () => void) | null>(null);
  const get = ref<((path: string) => unknown) | null>(null);

  function init(
    centralStoreProxy: unknown,
    subscribeFn: (path: string, callback: (value: unknown) => void) => () => void,
    getFn: (path: string) => unknown
  ) {
    store.value = centralStoreProxy;
    subscribe.value = subscribeFn;
    get.value = getFn;
  }

  function watchPath(path: string, callback: (value: unknown) => void) {
    if (!subscribe.value) return;
    return subscribe.value(path, callback);
  }

  function getPath(path: string) {
    return get.value ? get.value(path) : undefined;
  }

  function setPath(path: string, value: unknown) {
    if (!store.value || typeof store.value !== 'object') return;
    const parts = path.split('.');
    const lastKey = parts.pop();
    const target = parts.reduce(
      (obj: Record<string, unknown>, key) => obj[key] as Record<string, unknown>,
      store.value as Record<string, unknown>
    );
    if (target && lastKey) {
      target[lastKey] = value;
    }
  }

  return {
    store,
    init,
    watchPath,
    getPath,
    setPath,
  };
});

export const centralStorePlugin = {
  install(
    app: App,
    options?: {
      store?: unknown;
      storeSubscribe?: (path: string, callback: (value: unknown) => void) => () => void;
      storeGet?: (path: string) => unknown;
    }
  ) {
    const centralStore = useCentralStore();
    if (options?.store) {
      centralStore.init(
        options.store,
        options.storeSubscribe ?? (() => () => {}),
        options.storeGet ?? (() => undefined)
      );
    }
    app.config.globalProperties.$centralStore = centralStore;
    app.provide('centralStore', centralStore);
  },
};
