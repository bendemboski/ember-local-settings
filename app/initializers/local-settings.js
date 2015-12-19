import ENV from '../config/environment';

export function initialize(application) {
  const { localSettings: config = {} } = ENV;

  application.register('config:local-settings', config, { instantiate: false });
  application.inject('service:local-settings', 'config', 'config:local-settings');
}

export default {
  name: 'local-settings',
  initialize
};
