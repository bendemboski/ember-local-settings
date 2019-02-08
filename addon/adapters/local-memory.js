import EmberObject from '@ember/object';
import { alias } from '@ember/object/computed';

/**
 * Adapter that stores values in an in-memory hash.
 *
 * @class LocalMemoryAdapter
 * @exten extends Ember.Object
 */
let LocalMemoryAdapter = EmberObject.extend({
  /**
   * The storage hash (in the config so it's shared across all instances)
   *
   * @property storage
   * @private
   * @type Object
   */
  storage: alias('config.localMemoryStorage'),

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
  },

  init() {
    this._super(...arguments);

    // Make sure we have a storage hash
    if (!this.get('storage')) {
      this.set('storage', {});
    }
  }
});

export default LocalMemoryAdapter;

LocalMemoryAdapter.reopenClass({
  toString() {
    return "ember-local-settings/adapters/local-memory";
  },

  clearStorage() {
    LocalMemoryAdapter.prototype.storage = {};
  }
});
