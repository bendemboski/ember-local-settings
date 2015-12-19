import Ember from 'ember';
import WebStorageAdapter from './web-storage';

const { NAME_KEY } = Ember;

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
  storageAPI: 'sessionStorage'
});
SessionStorageAdapter[NAME_KEY] = 'SessionStorageLocalSettingsAdapter';

export default SessionStorageAdapter;
