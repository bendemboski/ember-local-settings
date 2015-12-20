import Ember from 'ember';
import SessionStorageAdapter from 'ember-local-settings/adapters/session-storage';
import { module, test } from 'qunit';

const keys = [
  "ember-local-settings-key1"
];
const [ key1 ] = keys;

const sessionStorage = window.sessionStorage;

function clearKeys() {
  Ember.A(keys).forEach((key) => sessionStorage.removeItem(key));
}

module("Unit | Adapter | session-storage", {
  beforeEach() {
    // Clean state for this test
    clearKeys();
    this.adapter = SessionStorageAdapter.create();
  },
  afterEach() {
    // Be a good citizen
    clearKeys();
  }
});

// Since this uses the same base class as LocalStorageAdapter, this is just a
// sanity check
test("sanity check", function(assert) {
  this.adapter.setValue(key1, "value1");
  assert.equal(sessionStorage.getItem(key1), "value1");
  assert.equal(this.adapter.getValue(key1), "value1");
});