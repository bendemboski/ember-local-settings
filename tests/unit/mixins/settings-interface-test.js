import { A } from '@ember/array';
import EmberObject, { computed } from '@ember/object';
import CookieAdapter from 'ember-local-settings/adapters/cookie';
import LocalMemoryAdapter from 'ember-local-settings/adapters/local-memory';
import LocalStorageAdapter from 'ember-local-settings/adapters/local-storage';
import SessionStorageAdapter from 'ember-local-settings/adapters/session-storage';
import JsonSerializer from 'ember-local-settings/serializers/json';
import NoopSerializer from 'ember-local-settings/serializers/noop';
import SettingsInterfaceMixin from 'ember-local-settings/mixins/settings-interface';
import { module, test } from 'qunit';

let TestObject = EmberObject.extend(SettingsInterfaceMixin);

module('Unit | Mixin | settings-interface', function() {
  test("creates adapter from config", function(assert) {
    function test(name, cls) {
      let obj = TestObject.create({ config: { adapter: name } });
      assert.ok(obj.get('adapter') instanceof cls, `creates '${name}' adapter`);
    }

    test('cookie', CookieAdapter);
    test('local-memory', LocalMemoryAdapter);
    test('local-storage', LocalStorageAdapter);
    test('session-storage', SessionStorageAdapter);
  });

  test("creates serializer from config", function(assert) {
    function test(name, cls) {
      let obj = TestObject.create({ config: { serializer: name } });
      assert.ok(obj.get('serializer') instanceof cls, `creates '${name}' serializer`);
    }

    test('json', JsonSerializer);
    test('noop', NoopSerializer);
  });

  test("setValue() and getValue() work", function(assert) {
    let obj = TestObject.create({
      config: {
        serializer: 'json',
        adapter: 'local-memory'
      }
    });

    obj.setValue('key', { value: 1 });
    assert.equal(obj.get('adapter').getValue('key'), JSON.stringify({ value: 1 }),
      "set passes the value through the serializer to the adapter");
    assert.deepEqual(obj.getValue('key'), { value: 1 },
      "get passes the value from the adapter through the serializer");
  });

  test("setValue() with null or undefined removes the value", function(assert) {
    let obj = TestObject.create({
      config: {
        serializer: 'noop',
        adapter: 'local-memory'
      }
    });

    obj.setValue('key1', 'value1');
    obj.setValue('key2', 'value2');

    obj.setValue('key1', null);
    assert.ok(!A(obj.get('serializer.storage')).includes('key1'), "setting to null deletes");

    obj.setValue('key2', undefined);
    assert.ok(!A(obj.get('serializer.storage')).includes('key2'), "setting to undefined deletes");
  });

  test("prefix is respected", function(assert) {
    let obj = TestObject.create({
      config: {
        serializer: 'noop',
        adapter: 'local-memory'
      },
      prefix: 'testPrefix/'
    });

    obj.setValue('key', 'value1');
    assert.equal(obj.get('adapter').getValue('testPrefix/key'), 'value1', "set respects prefix");
    assert.equal(obj.getValue('key'), 'value1', "get respects prefix");
    obj.setValue('key', null);
    assert.equal(obj.get('key'), null, "set (when deleting) respects prefix");
  });

  test("getKeys() works and respects prefix", function(assert) {
    let obj = TestObject.create({
      config: {
        serializer: 'noop',
        adapter: 'local-memory'
      },
      prefix: 'testPrefix/'
    });

    let adapter = obj.get('adapter');
    adapter.setValue('testPrefix/key1');
    adapter.setValue('testPrefix/key2');
    adapter.setValue('key3');
    adapter.setValue('otherPrefix/key4');

    assert.deepEqual(obj.getKeys().sort(), [ 'key1', 'key2' ].sort());
  });

  test("settings object works", function(assert) {
    let obj = TestObject.create({
      config: {
        serializer: 'json',
        adapter: 'local-memory'
      },
      prefix: 'testPrefix/'
    });

    assert.equal(obj.get('settings.key'), null, "get() returns null when key isn't set");

    obj.set('settings.key', { key: 'value' });
    assert.deepEqual(obj.getValue('key'), { key: 'value' }, "set() works");
    assert.ok(obj.get('adapter').getValue('testPrefix/key'), "set() respects prefix");
    assert.deepEqual(obj.get('settings.key'), { key: 'value' }, "get() works and respects prefix");
    obj.set('settings.key', null);
    assert.equal(obj.getValue('key'), null, "set() to null works");
  });

  test("settings object can accept property names used in SettingsInterfaceMixin", function(assert) {
    let obj = TestObject.create({
      config: {
        serializer: 'json',
        adapter: 'local-memory'
      }
    });
    const properties = [
      'adapter',
      'serializer',
      'prefix',
      'settings'
    ];

    let props = obj.getProperties(properties);
    A(properties).forEach((prop) => obj.set(`settings.${prop}`, "value"));
    assert.deepEqual(obj.getProperties(properties), props, "properties were unaffected");
  });

  test("settings object notifies of changes correctly", function(assert) {
    let MyClass = EmberObject.extend({
      localSettings: computed(function() {
        return TestObject.create({
          config: {
            serializer: 'json',
            adapter: 'local-memory'
          }
        });
      }),

      alias: computed('localSettings.settings.key', function() {
        return this.get('localSettings.settings.key');
      })
    });

    let obj = MyClass.create();
    obj.set('localSettings.settings.key', 'value1');
    assert.equal(obj.get('alias'), 'value1');
    obj.set('localSettings.settings.key', 'value2');
    assert.equal(obj.get('alias'), 'value2', "cache was invalidated");
  });
});
