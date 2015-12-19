import Ember from 'ember';
import SettingsInterfaceMixin from './mixins/settings-interface';

const { NAME_KEY } = Ember;

/**
 * An object implementing a settings interface.
 *
 * @extends Ember.Object
 * @uses SettingsInterfaceMixin
 */
let LocalSettingsInterface = Ember.Object.extend(SettingsInterfaceMixin, {
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
      prefix: this.get('prefix') + prefix
    });
  }
});
LocalSettingsInterface[NAME_KEY] = "LocalSettingsInterface";

export default LocalSettingsInterface;
