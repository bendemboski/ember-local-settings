import Ember from 'ember';
import adapters from '../adapters';
import serializers from '../serializers';

const {
  Mixin,
  computed,
  typeOf
} = Ember;

/**
 * A mixin implementing an interface to local settings
 *
 * @class SettingsInterfaceMixin
 * @private
 */
export default Mixin.create({
  /**
   * Helper property for defining the adapter
   *
   * @property _adapter
   * @private
   */
  _adapter: null,

  /**
   * The adapter object used to store values. Can be set as an object, a class,
   * or the name of an adapter.
   *
   * @property adapter
   */
  adapter: computed({
    get() {
      return this._adapter;
    },
    set(key, value) {
      this._adapter = getNamedType("adapter", adapters, value);
      return this._adapter;
    }
  }),

  /**
   * Helper property for defining the serializer
   *
   * @property _serializer
   * @private
   */
  _serializer: null,

  /**
   * The serializer object used to serialize/deserialize values. Can be set to
   * and object, a class, or the name of an serializer.
   *
   * @property serializer
   */
  serializer: computed({
    get() {
      return this._serializer;
    },
    set(key, value) {
      this._serializer = getNamedType("serializer", serializers, value);
      return this._serializer;
    }
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
  settings: computed(function() {
    // Play a little trick so we don't have to set any properties on the
    // settings object that could conflict with key names.
    let localSettings = this;
    let Settings = Ember.Object.extend({
      unknownProperty(key) {
        return localSettings.getValue(key);
      },
      setUnknownProperty(key, value) {
        return localSettings.setValue(key, value);
      }
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
    let value = this.get('adapter').getValue(`${this.get('prefix')}${key}`);
    return this.get('serializer').deserialize(value);
  },

  /**
   * Set a value.
   *
   * @param {String} key
   * @param {*} value
   * @returns {*} value
   */
  setValue(key, value) {
    key = `${this.get('prefix')}${key}`;

    let adapter = this.get('adapter');

    if (value === null || value === undefined) {
      adapter.deleteValue(key);
      return value;
    }

    adapter.setValue(key, this.get('serializer').serialize(value));
    return adapter.getValue(key);
  },

  /**
   * Get all stored keys
   *
   * @returns {Array}
   */
  getKeys() {
    let prefix = this.get('prefix');
    let keys = [];
    Ember.A(this.get('adapter').getKeys()).forEach((key) => {
      if (key.substring(0, prefix.length) === prefix) {
        keys.push(key.substring(prefix.length));
      }
    });
    return keys;
  }
});

/**
 * Helper method for setting the adapter and serializer properties.
 *
 * @private
 * @param {String} typeName "serializer" or "adapter" - used in exception messages
 * @param {Object} typeMap a mapping from serializer/adapter name to class
 * @param {*} value either a serializer/adapter name, class or instance
 * @returns {*} serializer/adapter instace
 */
function getNamedType(typeName, typeMap, value) {
  let type = typeOf(value);

  if (type === 'string') {
    if (!typeMap[value]) {
      throw new Error(`Unrecognized local settings ${typeName}: '${value}'`);
    }
    return typeMap[value].create();
  } else if (type === 'class') {
    return value.create();
  } else if (type === 'instance') {
    return value;
  } else {
    throw new Error(`Invalid ${typeName} type: ${type} (${type.toString()})`);
  }
}
