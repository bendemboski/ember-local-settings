/* global Cookies */
import Ember from 'ember';

const {
  NAME_KEY,
  computed
} = Ember;

/**
 * Adapter that stores values in cookies
 *
 * @class CookieAdapter
 * @extends Ember.Object
 */
let CookieAdapter = Ember.Object.extend({
  /**
   * Cookie expiry in days
   *
   * @property expires
   * @type Integer
   * @default 36500
   */
  expires: 36500,
  /**
   * Cookie path
   *
   * @property path
   * @type String
   * @default null
   */
  path: null,
  /**
   * Cookie domain
   *
   * @property domain
   * @type String
   * @default null
   */
  domain: null,
  /**
   * Cookie secure flag
   *
   * @property secure
   * @type Boolean
   * @default null
   */
  secure: null,

  /**
   * Options hash used when creating cookies
   *
   * @private
   * @type Object
   * @default {}
   */
  options: computed('expires', 'path', 'domain', 'secure', function() {
    let options = {};
    let props = this.getProperties([ 'expires', 'path', 'domain', 'secure' ]);
    Ember.A(Object.keys(props)).forEach((key) => {
      if (props[key]) {
        options[key] = props[key];
      }
    });
    return options;
  }),

  /**
   * Get a value
   *
   * @param {String} key
   * @returns {String} value
   */
  getValue(key) {
    return Cookies.get(key);
  },

  /**
   * Set a value
   *
   * @param {String} key
   * @param {String} value
   * @return {Void}
   */
  setValue(key, value) {
    Cookies.set(key, value, this.get('options'));
  },

  /**
   * Delete a value
   *
   * @param {String} key
   * @return {Void}
   */
  deleteValue(key) {
    Cookies.remove(key, this.get('options'));
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
    return Object.keys(Cookies.get());
  }
});
CookieAdapter[NAME_KEY] = "CookieLocalSettingsAdapter";

export default CookieAdapter;
