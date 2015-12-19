import NoopSerializer from 'ember-local-settings/serializers/noop';
import LocalMemoryAdapter from 'ember-local-settings/adapters/local-memory';
import { moduleFor, test } from 'ember-qunit';

moduleFor('service:local-settings', 'Unit | Service | local-settings');

test('it exists', function(assert) {
  let service = this.subject();
  assert.ok(service);
});

test("prefix and branching works", function(assert) {
  let service = this.subject({
    serializer: 'noop',
    adapter: 'local-memory',
    prefix: 'myapp/'
  });

  service.set('settings.key', 'value');
  assert.equal(service.get('settings.key'), 'value');
  assert.equal(service.get('adapter').getValue('myapp/key'), 'value');

  let interface = service.createBranch('path/');
  assert.equal(interface.get('prefix'), 'myapp/path/');
  assert.ok(!interface.get('settings.key'));

  service.set('settings.path/key2', 'value2');
  assert.equal(interface.get('settings.key2'), 'value2');
});

test("it initializes properties from its config", function(assert) {
  let service = this.subject({
    config: {
      serializer: 'noop',
      adapter: 'local-memory',
      prefix: 'myapp/'
    }
  });

  assert.ok(service.get('serializer') instanceof NoopSerializer);
  assert.ok(service.get('adapter') instanceof LocalMemoryAdapter);
  assert.equal(service.get('prefix'), 'myapp/');
});
