import { h, createApp } from 'vue';
import singleSpaVue from 'single-spa-vue';
import { cssLifecycleFactory } from 'vite-plugin-single-spa/ex';
import App from './App.vue';
import { setShared } from '@/shared/index';

const vueLifecycles = singleSpaVue({
  createApp,
  appOptions: {
    render: () => h(App),
  },
  handleInstance: (app, props) => {
    const { eventBus } = props;
    setShared('eventBus', eventBus);
    app.mount(props.domElement);
  },
});

const cssLc = cssLifecycleFactory('index');

export const bootstrap = [cssLc.bootstrap, vueLifecycles.bootstrap];
export const mount = [cssLc.mount, vueLifecycles.mount];
export const unmount = [cssLc.unmount, vueLifecycles.unmount];