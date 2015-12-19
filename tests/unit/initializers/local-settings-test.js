import Ember from 'ember';
import LocalSettingsService from '../../../services/local-settings';
import JsonSerializer from 'ember-local-settings/serializers/json';
import LocalMemoryAdapter from 'ember-local-settings/adapters/local-memory';
import LocalSettingsInitializer from '../../../initializers/local-settings';
import { module, test } from 'qunit';

let application;

module('Unit | Initializer | local settings', {
  beforeEach() {
    Ember.run(function() {
      application = Ember.Application.create();
      application.deferReadiness();
      application.register('service:local-settings', LocalSettingsService);
    });
  }
});

// Replace this with your real tests.
test('it works', function(assert) {
  LocalSettingsInitializer.initialize(application);

  let service = application.__container__.lookup('service:local-settings');

  // Values in dummy/config/environment.js
  assert.ok(service.get('serializer') instanceof JsonSerializer);
  assert.ok(service.get('adapter') instanceof LocalMemoryAdapter);
  assert.equal(service.get('prefix'), 'dummyApp/');
});
