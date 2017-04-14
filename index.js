/* eslint-env node */
'use strict';

const path = require('path');
const mergeTrees = require('broccoli-merge-trees');
const Funnel = require('broccoli-funnel');

module.exports = {
  name: 'ember-local-settings',

  included(app) {
    this._super(...arguments);

    // see: https://github.com/ember-cli/ember-cli/issues/3718
    while (typeof app.import !== 'function' && app.app) {
      app = app.app;
    }

    this.app = app;

    app.import(path.join(this.treePaths.vendor, 'js.cookie.js'));
    app.import(path.join(this.treePaths.vendor, 'js-cookie-shim.js'));
  },

  treeForVendor(vendorTree) {
    const jsCookieDir = path.dirname(require.resolve('js-cookie'));

    return mergeTrees([
      vendorTree,
      new Funnel(jsCookieDir, {
        files: ['js.cookie.js']
      })
    ]);
  }
};
