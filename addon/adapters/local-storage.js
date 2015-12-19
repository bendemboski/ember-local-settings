import Ember from 'ember';
import WebStorageAdapter from './web-storage';

const { NAME_KEY } = Ember;

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
LocalStorageAdapter[NAME_KEY] = 'LocalStorageLocalSettingsAdapter';

export default LocalStorageAdapter;
