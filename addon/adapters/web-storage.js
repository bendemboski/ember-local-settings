import EmberObject, { computed } from '@ember/object';

/**
 * Base class for adapters that store values in HTML5 web storage (localStorage
 * or sessionStorage)
 *
 * @class WebStorageAdapter
 * @private
 * @extends Ember.OBject
 */
export default EmberObject.extend({
  /**
   * The storage API to use -- either "localStorage" or "sessionStorage"
   *
   * @property storageAPI
   * @private
   */
  storageAPI: null,

  /**
   * The storage object -- window.localStorage or window.sessionStorage
   *
   * @property storage
   * @private
   */
  storage: computed('storageAPI', function () {
    return window[this.storageAPI];
  }),

  /**
   * Get a value
   *
   * @param {String} key
   * @returns {String} value
   */
  getValue(key) {
    return this.storage.getItem(key);
  },

  /**
   * Set a value
   *
   * @param {String} key
   * @param {String} value
   * @return {Void}
   */
  setValue(key, value) {
    this.storage.setItem(key, value);
  },

  /**
   * Delete a value
   *
   * @param {String} key
   * @return {Void}
   */
  deleteValue(key) {
    this.storage.removeItem(key);
  },

  /**
   * Get count of stored values
   *
   * @returns {Integer}
   */
  getItemCount() {
    return this.storage.length;
  },

  /**
   * Get the key of the stored value at an index
   *
   * @param {Integer} index
   * @returns {String}
   */
  getKeyAt(index) {
    return this.storage.key(index);
  },

  /**
   * Get an array of the keys of all the stored values
   *
   * @returns {Array}
   */
  getKeys() {
    let keys = [];
    let count = this.getItemCount();
    for (let i = 0; i < count; i++) {
      keys.push(this.getKeyAt(i));
    }
    return keys;
  },
});
