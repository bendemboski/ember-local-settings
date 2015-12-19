import LocalSettingsInterface from '../../local-settings-interface';
import { module, test} from 'qunit';

module('Unit | local-settings-interface');

test("branching works", function(assert) {
  let interface = LocalSettingsInterface.create({
    serializer: 'noop',
    adapter: 'local-memory'
  });

  let interface2 = interface.createBranch('level1/');
  assert.equal(interface2.get('prefix'), 'level1/');

  let interface3 = interface2.createBranch('level2/');
  assert.equal(interface3.get('prefix'), 'level1/level2/');
});
