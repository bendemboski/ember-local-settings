import EmberObject, { computed } from '@ember/object';
import Cookies from 'js-cookie';

/**
 * Adapter that stores values in cookies
 *
 * @class CookieAdapter
 * @extends Ember.Object
 */
let CookieAdapter = EmberObject.extend({
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
  options: computed('expires', 'path', 'domain', 'secure', function () {
    let options = {};
    let { expires, path, domain, secure } = this;
    if (expires) {
      options.expires = expires;
    }
    if (path) {
      options.path = path;
    }
    if (domain) {
      options.domain = domain;
    }
    if (secure) {
      options.secure = secure;
    }
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
    Cookies.set(key, value, this.options);
  },

  /**
   * Delete a value
   *
   * @param {String} key
   * @return {Void}
   */
  deleteValue(key) {
    Cookies.remove(key, this.options);
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
  },
});

CookieAdapter.reopenClass({
  toString() {
    return 'ember-local-settings/adapters/cookie';
  },
});

export default CookieAdapter;
