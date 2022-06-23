import Service from '@ember/service';
import SettingsInterfaceMixin from '../mixins/settings-interface';
import LocalSettingsInterface from '../local-settings-interface';
import { getOwner } from '@ember/application';

/**
 * A service implementing a settings interface.
 *
 * @class LocalSettingsService
 * @extends Ember.Service
 * @uses SettingsInterfaceMixin
 */
export default Service.extend(SettingsInterfaceMixin, {
  /**
   * Config object, read from environment
   *
   * @private
   * @property expires
   * @type Object
   */
  config: null,
  /**
   * Top-level prefix, initialized from config
   *
   * @private
   * @property expires
   * @type Object
   * @default ''
   */
  prefix: '',

  /**
   * On initialization, read in the config from the environment and use it to
   * set any unset properties.
   */
  init() {
    this._super(...arguments);

    let env = getOwner(this).resolveRegistration('config:environment') || {};
    let {
      localSettings: config = {
        serializer: 'json',
        adapter: 'local-storage',
        prefix: 'emberApp/',
      },
    } = env;
    // Make a copy so we can add properties to the config without it affecting
    // the environment
    this.set('config', { ...config });
    this.set('prefix', config.prefix || '');
  },

  /**
   * Create a "branch" -- a futher prefixed settings interface. The prefix is
   * appended to this service's prefix.
   *
   * @param prefix
   * @returns {*} settings interface
   */
  createBranch(prefix) {
    return LocalSettingsInterface.create({
      config: this.config,
      prefix: this.prefix + prefix,
    });
  },
});
