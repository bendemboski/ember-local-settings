import serializers from 'ember-local-settings/serializers';
import { module, test } from 'qunit';

module('Unit | serializers', function () {
  // eslint-disable-next-line qunit/require-expect
  test('serializers serialize to strings and round-trip', function (assert) {
    function runTest(name, serializer, value) {
      let serialized = serializer.serialize(value);
      assert.deepEqual(
        serializer.deserialize(serialized),
        value,
        `${name}: ${value} round-trips`
      );
    }

    Object.keys(serializers).forEach((name) => {
      let serializer = serializers[name].create();
      let doTest = (input) => runTest(name, serializer, input);

      doTest(null);
      doTest('');
      doTest([]);
      doTest({});
      doTest('string');
      doTest('5');
      doTest(1);
      doTest(1.5);
      doTest([1, 'string']);
      doTest({ key1: 'value', key2: 3 });
      doTest([
        { array: [1, '2', { key: 'value' }] },
        ['hello', [{}], 3],
        'string',
        1.6,
      ]);
    });
  });
});
