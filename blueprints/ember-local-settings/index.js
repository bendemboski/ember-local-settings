module.exports = {
  normalizeEntityName() {},

  afterInstall() {
    return this.addBowerPackageToProject('js-cookie', '~2.0.4');
  },
};
