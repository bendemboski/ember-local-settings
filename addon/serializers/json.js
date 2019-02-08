import EmberObject from '@ember/object';

/**
 * A serializer that serializes values to JSON strings.
 *
 * @class JsonSerializer
 * @extends Ember.Object
 */
let JsonSerializer = EmberObject.extend({
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

JsonSerializer.reopenClass({
  toString() {
    return "ember-local-settings/serializers/json";
  }
});

export default JsonSerializer;
