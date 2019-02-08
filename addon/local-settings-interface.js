import EmberObject from '@ember/object';
import SettingsInterfaceMixin from './mixins/settings-interface';

/**
 * An object implementing a settings interface.
 *
 * @extends Ember.Object
 * @uses SettingsInterfaceMixin
 */
let LocalSettingsInterface = EmberObject.extend(SettingsInterfaceMixin, {
  /**
   * Create a "branch" -- a futher prefixed settings interface. The prefix is
   * appended to this service's prefix.
   *
   * @param prefix
   * @returns {*} settings interface
   */
  createBranch(prefix) {
    return LocalSettingsInterface.create({
      config: this.get('config'),
      prefix: this.get('prefix') + prefix
    });
  }
});

LocalSettingsInterface.reopenClass({
  toString() {
    return "ember-local-settings/interface";
  }
});

export default LocalSettingsInterface;
