import { module, test } from 'qunit';
import { setupApplicationTest } from 'ember-qunit';
import JsonSerializer from 'ember-local-settings/serializers/json';
import LocalMemoryAdapter from 'ember-local-settings/adapters/local-memory';

module('Acceptance | Initializer', function(hooks) {
  setupApplicationTest(hooks);

  test('it works', function(assert) {
    let service = this.owner.lookup('service:local-settings');

    // Values in dummy/config/environment.js
    assert.ok(service.get('serializer') instanceof JsonSerializer);
    assert.ok(service.get('adapter') instanceof LocalMemoryAdapter);
    assert.equal(service.get('prefix'), 'dummyApp/');
  });
})
