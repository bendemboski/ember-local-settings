import Ember from 'ember';
import CookieAdapter from 'ember-local-settings/adapters/cookie';
import LocalMemoryAdapter from 'ember-local-settings/adapters/local-memory';
import LocalStorageAdapter from 'ember-local-settings/adapters/local-storage';
import SessionStorageAdapter from 'ember-local-settings/adapters/session-storage';
import JsonSerializer from 'ember-local-settings/serializers/json';
import NoopSerializer from 'ember-local-settings/serializers/noop';
import SettingsInterfaceMixin from 'ember-local-settings/mixins/settings-interface';
import { module, test } from 'qunit';

let TestObject = Ember.Object.extend(SettingsInterfaceMixin);

module('Unit | Mixin | settings-interface');

test("can set adapter by name", function(assert) {
  function test(name, cls) {
    let obj = TestObject.create({ adapter: name });
    assert.ok(obj.get('adapter') instanceof cls, `can set adapter to '${name}'`);
  }

  test('cookie', CookieAdapter);
  test('local-memory', LocalMemoryAdapter);
  test('local-storage', LocalStorageAdapter);
  test('session-storage', SessionStorageAdapter);
});

test("can set adapter by class", function(assert) {
  function test(name, cls) {
    let obj = TestObject.create({ adapter: cls });
    assert.ok(obj.get('adapter') instanceof cls, `can set adapter to '${name}'`);
  }

  test('cookie', CookieAdapter);
  test('local-memory', LocalMemoryAdapter);
  test('local-storage', LocalStorageAdapter);
  test('session-storage', SessionStorageAdapter);
});

test("can set adapter by instance", function(assert) {
  function test(name, cls) {
    let adapter = cls.create();
    let obj = TestObject.create({ adapter });
    assert.ok(obj.get('adapter') === adapter, `can set adapter to '${name}'`);
  }

  test('cookie', CookieAdapter);
  test('local-memory', LocalMemoryAdapter);
  test('local-storage', LocalStorageAdapter);
  test('session-storage', SessionStorageAdapter);
});

test("can set serializer by name", function(assert) {
  function test(name, cls) {
    let obj = TestObject.create({ serializer: name });
    assert.ok(obj.get('serializer') instanceof cls, `can set serializer to '${name}'`);
  }

  test('json', JsonSerializer);
  test('noop', NoopSerializer);
});

test("can set serializer by class", function(assert) {
  function test(name, cls) {
    let obj = TestObject.create({ serializer: cls });
    assert.ok(obj.get('serializer') instanceof cls, `can set serializer to '${name}'`);
  }

  test('json', JsonSerializer);
  test('noop', NoopSerializer);
});

test("can set serializer by instance", function(assert) {
  function test(name, cls) {
    let serializer = cls.create();
    let obj = TestObject.create({ serializer });
    assert.ok(obj.get('serializer') === serializer, `can set serializer to '${name}'`);
  }

  test('json', JsonSerializer);
  test('noop', NoopSerializer);
});

test("setValue() and getValue() work", function(assert) {
  let obj = TestObject.create({
    serializer: 'json',
    adapter: 'local-memory'
  });

  obj.setValue('key', { value: 1 });
  assert.equal(obj.get('adapter').getValue('key'), JSON.stringify({ value: 1 }),
    "set passes the value through the serializer to the adapter");
  assert.deepEqual(obj.getValue('key'), { value: 1 },
    "get passes the value from the adapter through the serializer");
});

test("setValue() with null or undefined removes the value", function(assert) {
  let obj = TestObject.create({
    serializer: 'noop',
    adapter: 'local-memory'
  });

  obj.setValue('key1', 'value1');
  obj.setValue('key2', 'value2');

  obj.setValue('key1', null);
  assert.ok(!Ember.A(obj.get('serializer.storage')).contains('key1'), "setting to null deletes");

  obj.setValue('key2', undefined);
  assert.ok(!Ember.A(obj.get('serializer.storage')).contains('key2'), "setting to undefined deletes");
});

test("prefix is respected", function(assert) {
  let obj = TestObject.create({
    serializer: 'noop',
    adapter: 'local-memory',
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
    serializer: 'noop',
    adapter: 'local-memory',
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
    serializer: 'json',
    adapter: 'local-memory',
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
    serializer: 'json',
    adapter: 'local-memory'
  });
  const properties = [
    'adapter',
    'serializer',
    'prefix',
    'settings'
  ];

  let props = obj.getProperties(properties);
  Ember.A(properties).forEach((prop) => obj.set(`settings.${prop}`, "value"));
  assert.deepEqual(obj.getProperties(properties), props, "properties were unaffected");
});
