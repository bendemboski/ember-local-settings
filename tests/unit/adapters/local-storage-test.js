import Ember from 'ember';
import LocalStorageAdapter from 'ember-local-settings/adapters/local-storage';
import { module, test } from 'qunit';

const keys = [
  "ember-local-settings-key1",
  "ember-local-settings-key2"
];
const [ key1, key2 ] = keys;

const localStorage = window.localStorage;

function clearKeys() {
  Ember.A(keys).forEach((key) => localStorage.removeItem(key));
}

module("Unit | Adapter | local-storage", {
  beforeEach() {
    // Clean state for this test
    clearKeys();
    this.adapter = LocalStorageAdapter.create();
  },
  afterEach() {
    // Be a good citizen
    clearKeys();
  }
});

test("getValue() works", function(assert) {
  assert.equal(this.adapter.getValue(key1), null, "value is null when not set");

  localStorage.setItem(key1, "value1");
  localStorage.setItem(key2, "value2");

  assert.equal(this.adapter.getValue(key1), "value1");
  assert.equal(this.adapter.getValue(key2), "value2");
});

test("setValue() works", function(assert) {
  this.adapter.setValue(key1, "value1");
  this.adapter.setValue(key2, "value2");

  assert.equal(localStorage.getItem(key1), "value1");
  assert.equal(localStorage.getItem(key2), "value2");
});

test("deleteValue() works", function(assert) {
  localStorage.setItem(key1, "value1");
  this.adapter.deleteValue(key1);
  assert.equal(this.adapter.getValue(key1), null);
});

test("getItemCount() works", function(assert) {
  let itemCount = this.adapter.getItemCount();

  localStorage.setItem(key1, "value1");
  assert.equal(this.adapter.getItemCount(), itemCount + 1, "the item count increased after setting a value");

  localStorage.removeItem(key1);
  assert.equal(this.adapter.getItemCount(), itemCount, "the item count decreased after deleting a value");
});

test("getKeyAt() works", function(assert) {
  localStorage.setItem(key1, "value1");
  localStorage.setItem(key2, "value2");

  let itemCount = this.adapter.getItemCount();
  let keys = [];
  for (let i = 0; i < itemCount; i++) {
    keys.push(this.adapter.getKeyAt(i));
  }

  assert.ok(Ember.A(keys).contains(key1), "key1 was found in the keys");
  assert.ok(Ember.A(keys).contains(key2), "key2 was found in the keys");
});

test("getKeys() works", function(assert) {
  localStorage.setItem(key1, "value1");
  localStorage.setItem(key2, "value2");

  let keys = this.adapter.getKeys();
  assert.ok(Ember.A(keys).contains(key1), "key1 was found in the keys");
  assert.ok(Ember.A(keys).contains(key2), "key1 was found in the keys");
});
