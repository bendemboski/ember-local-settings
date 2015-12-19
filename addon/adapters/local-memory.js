import Ember from 'ember';

const {
  NAME_KEY,
  computed
} = Ember;

/**
 * Adapter that stores values in an in-memory hash.
 *
 * @class LocalMemoryAdapter
 * @exten extends Ember.Object
 */
let LocalMemoryAdapter = Ember.Object.extend({
  /**
   * The storage hash
   *
   * @property storage
   * @private
   * @type Object
   */
  storage: computed(function() {
    return {};
  }),

  /**
   * Get a value
   *
   * @param {String} key
   * @returns {String} value
   */
  getValue(key) {
    return this.get('storage')[key];
  },

  /**
   * Set a value
   *
   * @param {String} key
   * @param {String} value
   * @return {Void}
   */
  setValue(key, value) {
    this.get('storage')[key] = value;
  },

  /**
   * Delete a value
   *
   * @param {String} key
   * @return {Void}
   */
  deleteValue(key) {
    delete this.get('storage')[key];
  },

  /**
   * Get count of stored values
   *
   * @returns {Integer}
   */
  getItemCount() {
    return this.getKeys().length;
  },

  /**
   * Get the key of the stored value at an index
   *
   * @param {Integer} index
   * @returns {String}
   */
  getKeyAt(index) {
    return this.getKeys()[index];
  },

  /**
   * Get an array of the keys of all the stored values
   *
   * @returns {Array}
   */
  getKeys() {
    return Object.keys(this.get('storage'));
  }
});
LocalMemoryAdapter[NAME_KEY] = "LocalMemoryLocalSettingsAdapter";

export default LocalMemoryAdapter;

LocalMemoryAdapter.reopenClass({
  clearStorage() {
    LocalMemoryAdapter.prototype.storage = {};
  }
});
