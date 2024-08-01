import { defineConfig } from 'cypress';
import getCompareSnapshotsPlugin from 'cypress-image-diff-js/plugin';

module.exports = defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      return getCompareSnapshotsPlugin(on, {
        ...config,
        generateHtmlReport: false,
        generateJsonReport: false
      });
    },
    viewportWidth: 576,
    viewportHeight: 1024,
    chromeWebSecurity: false,
    experimentalModifyObstructiveThirdPartyCode: true,
    responseTimeout: 60000
  }
});
