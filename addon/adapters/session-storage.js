import WebStorageAdapter from './web-storage';

/**
 * Adapter that stores values in HTML5 local storage.
 *
 * @class SessionStorageAdapter
 * @extends WebStorageAdapter
 */
let SessionStorageAdapter = WebStorageAdapter.extend({
  /**
   * @property storageAPI
   * @private
   */
  storageAPI: 'sessionStorage',
});

SessionStorageAdapter.reopenClass({
  toString() {
    return 'ember-local-settings/adapters/session-storage';
  },
});

export default SessionStorageAdapter;
