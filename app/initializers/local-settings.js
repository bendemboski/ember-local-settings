export function initialize(application) {
  let env = application.resolveRegistration('config:environment') || {};
  let {
    localSettings: config = {
      serializer: 'json',
      adapter: 'local-storage',
      prefix: 'emberApp/'
    }
  } = env;

  application.register('config:local-settings', config, { instantiate: false });
  application.inject('service:local-settings', 'config', 'config:local-settings');
}

export default {
  name: 'local-settings',
  initialize
};
