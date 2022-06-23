import { A } from '@ember/array';
import Cookies from 'js-cookie';
import CookieAdapter from 'ember-local-settings/adapters/cookie';
import { module, test } from 'qunit';

module('Unit | Adapter | cookie', function (hooks) {
  const keys = ['ember-local-settings-key1', 'ember-local-settings-key2'];
  const [key1, key2] = keys;

  function clearKeys() {
    A(keys).forEach((key) => Cookies.remove(key));
  }

  hooks.beforeEach(function () {
    // Clean state for this test
    clearKeys();
    this.adapter = CookieAdapter.create();
  });
  hooks.afterEach(function () {
    // Be a good citizen
    clearKeys();
  });

  test('getValue() works', function (assert) {
    assert.strictEqual(
      this.adapter.getValue(key1),
      undefined,
      'value is undefined when not set'
    );

    Cookies.set(key1, 'value1');
    Cookies.set(key2, 'value2');

    assert.strictEqual(this.adapter.getValue(key1), 'value1');
    assert.strictEqual(this.adapter.getValue(key2), 'value2');
  });

  test('setValue() works', function (assert) {
    this.adapter.setValue(key1, 'value1');
    this.adapter.setValue(key2, 'value2');

    assert.strictEqual(Cookies.get(key1), 'value1');
    assert.strictEqual(Cookies.get(key2), 'value2');
  });

  test('deleteValue() works', function (assert) {
    Cookies.set(key1, 'value1');
    this.adapter.deleteValue(key1);
    assert.strictEqual(this.adapter.getValue(key1), undefined);
  });

  test('getItemCount() works', function (assert) {
    let itemCount = this.adapter.getItemCount();

    Cookies.set(key1, 'value1');
    assert.strictEqual(
      this.adapter.getItemCount(),
      itemCount + 1,
      'the item count increased after setting a value'
    );

    Cookies.remove(key1);
    assert.strictEqual(
      this.adapter.getItemCount(),
      itemCount,
      'the item count decreased after deleting a value'
    );
  });

  test('getKeyAt() works', function (assert) {
    Cookies.set(key1, 'value1');
    Cookies.set(key2, 'value2');

    let itemCount = this.adapter.getItemCount();
    let keys = [];
    for (let i = 0; i < itemCount; i++) {
      keys.push(this.adapter.getKeyAt(i));
    }

    assert.ok(A(keys).includes(key1), 'key1 was found in the keys');
    assert.ok(A(keys).includes(key2), 'key2 was found in the keys');
  });

  test('getKeys() works', function (assert) {
    Cookies.set(key1, 'value1');
    Cookies.set(key2, 'value2');

    let keys = this.adapter.getKeys();
    assert.ok(A(keys).includes(key1), 'key1 was found in the keys');
    assert.ok(A(keys).includes(key2), 'key1 was found in the keys');
  });

  test('options are constructed properly', function (assert) {
    // There's no good way of verifying that the options actually persisted to
    // the cookie, so we'll just verify that the options property is contructed
    // correctly.

    assert.deepEqual(this.adapter.get('options'), {
      expires: 36500,
    });

    this.adapter.set('path', '/somewhere');
    assert.deepEqual(this.adapter.get('options'), {
      expires: 36500,
      path: '/somewhere',
    });

    this.adapter.set('domain', 'some.domain.com');
    assert.deepEqual(this.adapter.get('options'), {
      expires: 36500,
      path: '/somewhere',
      domain: 'some.domain.com',
    });

    this.adapter.set('secure', true);
    assert.deepEqual(this.adapter.get('options'), {
      expires: 36500,
      path: '/somewhere',
      domain: 'some.domain.com',
      secure: true,
    });
  });
});
