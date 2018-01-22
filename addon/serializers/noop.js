import EmberObject from '@ember/object';
import Ember from 'ember';

const { NAME_KEY } = Ember;

/**
 * A serializer that passes values through as-is. Can only be used with
 * adapters that accept any type, or in environments where only strings need
 * to be stored.
 *
 * @class NoopSerializer
 * @extends Ember.Object
 */
let NoopSerializer = EmberObject.extend({
  /**
   * Serialize a value
   *
   * @param value
   * @returns {*}
   */
  serialize(value) {
    return value;
  },

  /**
   * Deserializer a value
   *
   * @param value
   * @returns {*}
   */
  deserialize(value) {
    return value;
  }
});
NoopSerializer[NAME_KEY] = "NoopLocalSettingsSerializer";

export default NoopSerializer;
