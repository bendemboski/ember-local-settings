import Ember from 'ember';

const { computed } = Ember;

/**
 * Base class for adapters that store values in HTML5 web storage (localStorage
 * or sessionStorage)
 *
 * @class WebStorageAdapter
 * @private
 * @extends Ember.OBject
 */
export default Ember.Object.extend({
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
  storage: computed('storageAPI', function() {
    return window[this.get('storageAPI')];
  }),

  /**
   * Get a value
   *
   * @param {String} key
   * @returns {String} value
   */
  getValue(key) {
    return this.get('storage').getItem(key);
  },

  /**
   * Set a value
   *
   * @param {String} key
   * @param {String} value
   * @return {Void}
   */
  setValue(key, value) {
    this.get('storage').setItem(key, value);
  },

  /**
   * Delete a value
   *
   * @param {String} key
   * @return {Void}
   */
  deleteValue(key) {
    this.get('storage').removeItem(key);
  },

  /**
   * Get count of stored values
   *
   * @returns {Integer}
   */
  getItemCount() {
    return this.get('storage').length;
  },

  /**
   * Get the key of the stored value at an index
   *
   * @param {Integer} index
   * @returns {String}
   */
  getKeyAt(index) {
    return this.get('storage').key(index);
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
  }
});
