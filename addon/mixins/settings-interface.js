import { A } from '@ember/array';
import Mixin from '@ember/object/mixin';
import EmberObject, { computed } from '@ember/object';
import adapters from '../adapters';
import serializers from '../serializers';

/**
 * A mixin implementing an interface to local settings
 *
 * @class SettingsInterfaceMixin
 * @private
 */
export default Mixin.create({
  /**
   * The adapter object used to store values
   *
   * @property adapter
   */
  adapter: computed('config.adapter', function () {
    let name = this.config.adapter;
    let cls = adapters[name];
    if (!cls) {
      throw new Error(`Unrecognized local settings adapter: '${name}'`);
    }
    return cls.create({ config: this.config });
  }),

  /**
   * The serializer object used to serialize/deserialize values
   *
   * @property serializer
   */
  serializer: computed('config.serializer', function () {
    let name = this.config.serializer;
    let cls = serializers[name];
    if (!cls) {
      throw new Error(`Unrecognized local settings serializer: '${name}'`);
    }
    return cls.create({ config: this.config });
  }),

  /**
   * The prefix for stored values. This can be used to implement namespaces or
   * paths or a similar mechanism for modularizing settings values. Any keys
   * passed into methods on this object will have this prefix prepended to them
   * before they are passed to the adapter.
   *
   * @property prefix
   */
  prefix: '',

  /**
   * Settings proxy object. The get() and set() methods on this object
   * are forwarded to getValue and setValue, and can be used as direct
   * accessors to stored values.
   *
   * @property settings
   */
  settings: computed(function () {
    // Play a little trick so we don't have to set any properties on the
    // settings object that could conflict with key names.
    let localSettings = this;
    let Settings = EmberObject.extend({
      unknownProperty(key) {
        return localSettings.getValue(key);
      },
      setUnknownProperty(key, value) {
        let ret = localSettings.setValue(key, value);
        this.notifyPropertyChange(key);
        return ret;
      },
    });
    return Settings.create();
  }),

  /**
   * Get a value.
   *
   * @param {String} key
   * @returns {*}
   */
  getValue(key) {
    let value = this.adapter.getValue(`${this.prefix}${key}`);
    return this.serializer.deserialize(value);
  },

  /**
   * Set a value.
   *
   * @param {String} key
   * @param {*} value
   * @returns {*} value
   */
  setValue(key, value) {
    key = `${this.prefix}${key}`;

    let adapter = this.adapter;

    if (value === null || value === undefined) {
      adapter.deleteValue(key);
      return value;
    }

    adapter.setValue(key, this.serializer.serialize(value));
    return adapter.getValue(key);
  },

  /**
   * Get all stored keys
   *
   * @returns {Array}
   */
  getKeys() {
    let prefix = this.prefix;
    let keys = [];
    A(this.adapter.getKeys()).forEach((key) => {
      if (key.substring(0, prefix.length) === prefix) {
        keys.push(key.substring(prefix.length));
      }
    });
    return keys;
  },
});
