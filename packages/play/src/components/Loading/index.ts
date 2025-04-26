import { Loading } from './service';
import { vLoading } from './directive';
import type { App } from 'vue';

export const HsLoading = {
  name: 'HsLoading',
  install(app: App) {
    app.config.globalProperties.$loading = Loading;
    app.directive('loading', vLoading);
  },
  service: Loading,
  directive: vLoading,
};

export default HsLoading;
export {
  Loading as HsLoadingService,
  vLoading,
  vLoading as HsLoadingDirective,
};
export * from './types';