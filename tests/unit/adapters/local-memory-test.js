import LocalMemoryAdapter from 'ember-local-settings/adapters/local-memory';
import { module, test } from 'qunit';

module("Unit | Adapter | local-memory", {
  beforeEach() {
    // Clean state for this test
    LocalMemoryAdapter.clearStorage();
    this.adapter = LocalMemoryAdapter.create();
  },
  afterEach() {
    // Be a good citizen
    LocalMemoryAdapter.clearStorage();
  }
});

test("setValue(), deleteValue() and getValue() round-trip", function(assert) {
  assert.equal(this.adapter.getValue('key'), null, "value is null when not set");

  this.adapter.setValue('key', 'value');
  assert.equal(this.adapter.getValue('key'), 'value');

  this.adapter.setValue('key', 'value2');
  assert.equal(this.adapter.getValue('key'), 'value2');

  this.adapter.deleteValue('key');
  assert.equal(this.adapter.getValue('key'), null, "value is null after being deleted");
});

test("getItemCount() works", function(assert) {
  assert.equal(this.adapter.getItemCount(), 0);

  this.adapter.setValue('key', 'value');
  assert.equal(this.adapter.getItemCount(), 1);

  this.adapter.setValue('key', 'value2');
  assert.equal(this.adapter.getItemCount(), 1);

  this.adapter.setValue('key2', 'value2');
  assert.equal(this.adapter.getItemCount(), 2);

  this.adapter.deleteValue('key');
  assert.equal(this.adapter.getItemCount(), 1);
});

test("getKeyAt() works", function(assert) {
  this.adapter.setValue('key', 'value');
  this.adapter.setValue('key2', 'value2');

  let keys = [
    this.adapter.getKeyAt(0),
    this.adapter.getKeyAt(1)
  ];

  assert.deepEqual(keys.sort(), [ 'key', 'key2' ].sort());
});

test("getKeys() works", function(assert) {
  assert.deepEqual(this.adapter.getKeys(), []);

  this.adapter.setValue('key', 'value');
  this.adapter.setValue('key2', 'value2');

  assert.deepEqual(this.adapter.getKeys().sort(), [ 'key', 'key2' ].sort());
});

test("values are shared across instances", function(assert) {
  let adapter2 = LocalMemoryAdapter.create();
  this.adapter.setValue('key', 'value');
  assert.ok(adapter2.getValue('key'), 'value');
});
