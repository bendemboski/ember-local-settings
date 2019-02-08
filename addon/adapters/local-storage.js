import WebStorageAdapter from './web-storage';

/**
 * Adapter that stores values in HTML5 local storage.
 *
 * @class LocalStorageAdapter
 * @extends WebStorageAdapter
 */
let LocalStorageAdapter = WebStorageAdapter.extend({
  /**
   * @property storageAPI
   * @private
   */
  storageAPI: 'localStorage'
});

LocalStorageAdapter.reopenClass({
  toString() {
    return "ember-local-settings/adapters/local-storage";
  }
});

export default LocalStorageAdapter;
