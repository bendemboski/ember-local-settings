import Ember from 'ember';
import SettingsInterfaceMixin from '../mixins/settings-interface';
import LocalSettingsInterface from '../local-settings-interface';

const {
  Service,
  on
} = Ember;

/**
 * A service implementing a settings interface.
 *
 * @class LocalSettingsService
 * @extends Ember.Service
 * @uses SettingsInterfaceMixin
 */
export default Service.extend(SettingsInterfaceMixin, {
  /**
   * On initialization, read in the config property and use it to set any unset
   * properties. This config property is meant to be injected from an
   * initializer to allow easier configuration of the service, e.g. from the
   * environment.
   */
  initConfig: on('init', function() {
    const configProps = [ 'adapter', 'serializer', 'prefix' ];
    const config = this.get('config') || {};
    Ember.A(configProps).forEach((prop) => {
      if (config[prop] && !this.get(prop)) {
        this.set(prop, config[prop]);
      }
    });
  }),

  /**
   * Create a "branch" -- a futher prefixed settings interface. The prefix is
   * appended to this service's prefix.
   *
   * @param prefix
   * @returns {*} settings interface
   */
  createBranch(prefix) {
    return LocalSettingsInterface.create({
      serializer: this.get('serializer'),
      adapter: this.get('adapter'),
      prefix: this.get('prefix')  + prefix
    });
  }
});
