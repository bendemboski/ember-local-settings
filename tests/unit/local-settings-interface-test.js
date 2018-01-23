import LocalSettingsInterface from '../../local-settings-interface';
import { module, test } from 'qunit';

module('Unit | local-settings-interface', function() {
  test("branching works", function(assert) {
    let iface = LocalSettingsInterface.create({
      serializer: 'noop',
      adapter: 'local-memory'
    });

    let iface2 = iface.createBranch('level1/');
    assert.equal(iface2.get('prefix'), 'level1/');

    let iface3 = iface2.createBranch('level2/');
    assert.equal(iface3.get('prefix'), 'level1/level2/');
  });
});
