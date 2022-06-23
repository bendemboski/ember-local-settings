import { assign } from '@ember/polyfills';

export function initialize(appInstance) {
  let env = appInstance.resolveRegistration('config:environment') || {};
  let {
    localSettings: config = {
      serializer: 'json',
      adapter: 'local-storage',
      prefix: 'emberApp/',
    },
  } = env;

  // The local memory adapter stores state in the configuration that we want to
  // be isolated by application, so we implement this as an instance initializer
  // that injects a copy of the config into the service.
  appInstance.register('config:local-settings', assign({}, config), {
    instantiate: false,
  });
  appInstance.inject(
    'service:local-settings',
    'config',
    'config:local-settings'
  );
}

export default {
  initialize,
};
