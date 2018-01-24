import { module, test } from 'qunit';
import { setupApplicationTest } from 'ember-qunit';

module('Acceptance | local memory', function(hooks) {
  setupApplicationTest(hooks);

  test('first run', function(assert) {
    let service = this.owner.lookup('service:local-settings');
    service.set('settings.someKey', 'someValue');
    assert.ok(true);
  });

  test('it resets state between tests', function(assert) {
    let service = this.owner.lookup('service:local-settings');
    assert.notOk(service.get('settings.someKey'));
  });
});
