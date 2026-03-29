import { h, createApp } from 'vue';
import singleSpaVue from 'single-spa-vue';
import { createPinia } from 'pinia';
import { cssLifecycleFactory } from 'vite-plugin-single-spa/ex';
import App from './App.vue';
import { setShared } from '@/shared/index';
import { centralStorePlugin } from '@/http/centralStore';

const vueLifecycles = singleSpaVue({
  createApp,
  appOptions: {
    render: () => h(App),
  },
  handleInstance: (app, props) => {
    const { eventBus, centralStore } = props;
    setShared('eventBus', eventBus);

    const pinia = createPinia();
    app.use(pinia);

    if (centralStore) {
      app.use(centralStorePlugin, {
        store: centralStore.store,
        storeSubscribe: centralStore.storeSubscribe,
        storeGet: centralStore.storeGet,
      });
    }

    app.mount(props.domElement);
  },
});

const cssLc = cssLifecycleFactory('index');

export const bootstrap = [cssLc.bootstrap, vueLifecycles.bootstrap];
export const mount = [cssLc.mount, vueLifecycles.mount];
export const unmount = [cssLc.unmount, vueLifecycles.unmount];