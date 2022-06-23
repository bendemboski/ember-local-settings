import Service from '@ember/service';
import SettingsInterfaceMixin from '../mixins/settings-interface';
import LocalSettingsInterface from '../local-settings-interface';

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
   * On initialization, read in the config property and use it to set any unset
   * properties. This config property is meant to be injected from an
   * initializer to allow easier configuration of the service, e.g. from the
   * environment.
   */
  init() {
    this._super(...arguments);

    let config = this.config;
    if (!config) {
      // This only happens in tests when the initializer didn't run
      config = { adapter: 'local-memory', serializer: 'json' };
      this.set('config', config);
    }

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
