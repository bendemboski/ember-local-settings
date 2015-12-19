import Ember from 'ember';

const { NAME_KEY } = Ember;

/**
 * A serializer that serializes values to JSON strings.
 *
 * @class JsonSerializer
 * @extends Ember.Object
 */
let JsonSerializer = Ember.Object.extend({
  /**
   * Serialize a value
   *
   * @param value
   * @returns {String} JSON string
   */
  serialize(value) {
    if (value === null || value === undefined) {
      return null;
    }
    return JSON.stringify(value);
  },

  /**
   * Deserialize a value
   *
   * @param {String} JSON string
   * @returns {*} value
   */
  deserialize(value) {
    if (value === null || value === undefined) {
      return null;
    }
    return JSON.parse(value);
  }
});
JsonSerializer[NAME_KEY] = "JsonLocalSettingsSerializer";

export default JsonSerializer;
