import JsonSerializer from 'ember-local-settings/serializers/json';
import LocalMemoryAdapter from 'ember-local-settings/adapters/local-memory';
import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

module('Integration | Service | local settings', function(hooks) {
  setupTest(hooks);

  let owner;
  hooks.beforeEach(function() {
    owner = this.owner;
  });

  function getService() {
    return owner.lookup('service:local-settings');
  }

  test('it exists', function(assert) {
    let service = getService();
    assert.ok(service);
  });

  test("prefix and branching works", function(assert) {
    let service = getService();

    service.set('settings.key', 'value');
    assert.equal(service.get('settings.key'), 'value');
    assert.equal(service.get('adapter').getValue('dummyApp/key'), '"value"');

    let iface = service.createBranch('path/');
    assert.equal(iface.get('prefix'), 'dummyApp/path/');
    assert.ok(!iface.get('settings.key'));

    service.set('settings.path/key2', 'value2');
    assert.equal(iface.get('settings.key2'), 'value2');
  });

  test("it initializes properties from its config", function(assert) {
    let service = getService();

    assert.ok(service.get('serializer') instanceof JsonSerializer);
    assert.ok(service.get('adapter') instanceof LocalMemoryAdapter);
    assert.equal(service.get('prefix'), 'dummyApp/');
  });
});
