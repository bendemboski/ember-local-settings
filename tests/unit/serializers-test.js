import serializers from 'ember-local-settings/serializers';
import { module, test } from 'qunit';

module("Unit | serializers", function() {
  test("serializers serialize to strings and round-trip", function(assert) {
    function runTest(name, serializer, value) {
      let serialized = serializer.serialize(value);
      assert.deepEqual(serializer.deserialize(serialized), value, `${name}: ${value} round-trips`);
    }

    Object.keys(serializers).forEach((name) => {
      let serializer = serializers[name].create();
      let test = (input) => runTest(name, serializer, input);

      test(null);
      test("");
      test([]);
      test({});
      test("string");
      test("5");
      test(1);
      test(1.5);
      test([ 1, "string" ]);
      test({ key1: "value", key2: 3 });
      test([
        { array: [ 1, "2", { key: "value" } ] },
        [ "hello", [ {} ], 3 ],
        "string",
        1.6
      ]);
    });
  });
});
