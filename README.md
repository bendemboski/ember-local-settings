# ember-local-settings
*Store data in various local storages using easy Ember set/get semantics*

This addon adds a `local-settings` service and `LocalSettingsInterface` object to your app that makes it simple to store values in various local storages without worrying about the different semantics.

It uses a serializer/adapter model much like Ember Data -- the serializer converts the data to and from a storable format and the adapter performs the storage operations.

#### Adapters

1. `local-storage`
  - Stores data in HTML5 local storage (persists across browser sessions)
1. `session-storage`
  - Stores data in HTML5 session storage (cleared when browser is closed)
1. `cookie`
  - Stores data in cookies
1. `local-memory`
  - Stores data in memory (useful for unit tests)

#### Serializers

1. `json`
  - Uses `JSON.stringify` and `JSON.parse` to store the data as JSON strings
1. `noop`
  - Leaves the data as-is. Can only be used with the `local-memory` adapter, or if only strings need to be stored.
  
## Configuration

The easiest way to configure the service is through `config/environment`:

```javascript
module.exports = function(environment) {
  var ENV = {
    // ...
    localSettings: {
      serializer: 'json',
      adapter: 'local-storage',
      prefix: 'myAppName/'
    }
  };
  
  if (environment === 'test') {
    ENV.localSettings.adapter = 'local-memory';
  }
  // ...
}
```

Using the `local-memory` adapter is recommended for test mode so that tests don't leak state into other tests through more persistent storage.

Alternatively, the service can be configured manually, for example, via an initializer:

```javascript
export function initialize(application) {
  const config = {
    serializer: 'json',
    adapter: 'local-storage',
    prefix: 'myAppName/'
  };

  application.register('config:local-settings', config, { instantiate: false });
  application.inject('service:local-settings', 'config', 'config:local-settings');
}
```

or via an instance initializer:

```javascript
export function initialize(application) {
  let service = application.container.lookup('service:local-settings');
  service.setProperties({
    serializer: 'json',
    adapter: 'local-storage',
    prefix: 'myAppName/'
  });
}
```

### Using your own serializer and adapters

The `serializer` and `adapter` arguments in either of the initializers above can also be an instance or a class, so if you implement your own serializer or adapter, simply pass in the class or an instance, and if you think it would be useful, submit a pull request to include it in the addon!

## Usage

There are two APIs that you can use to get and store values. The first one is the using the `getValue()` and `setValue()` method on the service. The second is using the `settings` proxy, which allows access using Ember `get()` and `set()` semantics:

```javascript
import Ember from 'Ember';

export default Ember.Controller.extend({
  localSettings: Ember.inject.service('local-settings'),
  
  doStuff() {
    let localSettings = this.get('localSettings');
    // The following are equivalent:
    localSettings.setValue('key', 'value');
    localSettings.set('settings.key', 'value');
    localSettings.get('settings').set('key', 'value');
    
    localSettings.getValue('key');
    localSettings.get('settings.key');
    localSettings.get('settings').get('key');
  }
});
```

Because the `settings` proxy uses Ember `get()` and `set()` semantics, it cannot be used with keys that contain `.`s. `getValue()` and `setValue()` have no such restriction.

Using either interface, setting a value to `null` or `undefined` will delete the value, and getting a deleted/unset value will return `null`.

### Prefixes & branching

Prefixes allow you to scope settings to your application or to specific parts of your application. When writing to persistent back-ends like local storage, you'll want to make sure your settings don't conflict with anything else writing to local storage served from your same domain, which is why it's a good idea to configure the service with a prefix using something like your application name.

Similarly, if your application is complex enough, you might have different parts of it writing settings (e.g. components that want to save state), so you might want to be able to apply prefixes to specific areas of your code. You can do this with the `createBranch()` method on the service, which allows you to specify another prefix and get back an object with the same semantics as the service, and with the new prefix appended to the service's prefix. This object, in turn, also implements `createBranch()` so you can continue branching as deep as you like:

```javascript
import Ember from 'Ember';

export default Ember.Controller.extend({
  localSettings: Ember.inject.service('local-settings'),
  
  doStuff() {
    let localSettings = this.get('localSettings');
    // If localSettings is configured with the prefix 'myApp' then this will be
    // stored in the underlying storage as 'myApp/key'.
    localSettings.set('settings.key', 'value');
    
    let branch = localSettings.createBranch('branch/');
    branch.get('settings.key'); // null
    branch.set('settings.key', 'branchValue');
    
    localSettings.get('settings.key'); // 'value'
    localSettings.get('settings.branch/key'); // 'branchValue'
    
    let subBranch = branch.createBranch('subBranch/');
    subBranch.set('settings.key', 'subBranchValue');
    
    localSettings.get('settings.branch/subBranch/key'); // 'subBranchValue'
    branch.get('settings.subBranch/key'); // 'subBranchValue'
    subBranch.get('settings.key'); // 'subBranchValue'
    
    localSettings.get('settings.key'); // 'value'
    branch.get('settings.key'); // 'branchValue'
    subBranch.get('settings.key'); // 'subBranchValue'
  }
});
```

Each branch will share the serializer and adapter of its parent.

### Non-singleton usage

The entire implementation is also available via the `LocalSettingsInterface` class, which is a simple class extending `Ember.Object` which you can instantiate directly:

```javascript
import LocalSettingsInterface from 'local-settings-interface';

let interface = LocalSettingsInterface.create({
  serializer: 'json',
  adapter: 'local-storage',
  prefix: 'myAppName/'
});
interface.set('settings.key', 'value');
let branch = interface.createBranch('branch/');
```

`LocalSettingsInterface` has exactly the same API as the service -- in fact, it's instances of this object that are returned when you call `createBranch()` on the service!

#### A note about the local memory adapter

Since the `local-memory` adapter stores its values in local memory, if you instantiate multiple instances of `LocalSettingsInterface` you can either pass it the same adapter instance, in which case they will all share the same storage, or different adapter instances, in which case they will each have their own storage. This is mostly useful for isolation in unit tests.

## Installing The Addon

```shell
ember install ember-local-settings
```

## Installation

* `git clone` this repository
* `npm install`
* `bower install`

## Running

* `ember server`
* Visit your app at http://localhost:4200.

## Running Tests

* `npm test` (Runs `ember try:testall` to test your addon against multiple Ember versions)
* `ember test`
* `ember test --server`

## Building

* `ember build`

For more information on using ember-cli, visit [http://www.ember-cli.com/](http://www.ember-cli.com/).
