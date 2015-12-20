import ENV from '../config/environment';

export function initialize() {
  // Depending on the context the first argument might be the registry, or it
  // might be the application.
  const application = arguments[1] || arguments[0];
  const {
    localSettings: config = {
      serializer: 'json',
      adapter: 'local-storage',
      prefix: 'emberApp/'
    }
  } = ENV;

  application.register('config:local-settings', config, { instantiate: false });
  application.inject('service:local-settings', 'config', 'config:local-settings');
}

export default {
  name: 'local-settings',
  initialize
};
