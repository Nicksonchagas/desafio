const Data = require('./environments_parameters.json');
const TEST_ENV = process.env.TEST_ENV || 'local';

let environmentParameters = '';

switch (TEST_ENV) {

  case 'local':
    environmentParameters = Data.local
    break
  case 'localDev':
    environmentParameters = Data.localDev
    break
  case 'CI':
    environmentParameters = Data.CI
    break
}
console.log(process.env.TAG)

exports.config = {
  seleniumAddress: environmentParameters.seleniumAddress,
  ignoreUncaughtExceptions: true,
  framework: 'custom',
  frameworkPath: require.resolve('protractor-cucumber-framework'),
  restartBrowserBetweenTests: false,
  getPageTimeout: 50000,
  allScriptsTimeout: 30000,
  rootElement: '*[ng-app]',
  baseUrl: environmentParameters.baseUrl,
  TEST_ENV,
  params: {
    environment: null
  },

  specs: [
    'features/*.feature'
  ],

  exclude: [
  ],

  capabilities: {
    metadata: {
      device: TEST_ENV === 'local' ? 'Notebook' : 'Zalenium Amazon',
      platform: {
        name: TEST_ENV === 'local' ? 'Windows' : 'Linux',
        version: TEST_ENV === 'local' ? '10' : ''
      }
    },
    'recordVideo': true,
    'name': 'Zalenium - Protractor - Gmusic',
    shardTestFiles: true,
    maxInstances: 3,
    'browserName': 'chrome',
    chromeOptions: {
      args: [process.env.TAG == '@idtoken' ? '--headless' : '--disable-gpu', 'disable-infobars',
      process.env.TAG == '@idtoken' ? '--window-size=1024,765' : 'start-maximized']
    }
  },
  cucumberOpts: {
    format: 'json:reports/results.json',
    tags: process.env.TAG || ''
  },

  plugins: [{
    package: 'protractor-multiple-cucumber-html-reporter-plugin',
    options: {
      automaticallyGenerateReport: true,
      removeExistingJsonReportFile: true,
      removeOriginalJsonReportFile: true,
      displayDuration: true
    }
  }],
  onCleanUp: function (results) {
    // retry.onCleanUp(results);
  },
  afterLaunch: function () {
    //return retry.afterLaunch(2);
  },
  beforeLaunch: function () {
    SELENIUM_PROMISE_MANAGER: false
    setTimeout(function () {
    })
  },

  onPrepare: function () {
    // Use only for angular applications
    // False: app Angular
    // True: app not Angular
    browser.ignoreSynchronization = true
    browser.executeScript(function () {
    });
    // retry.onPrepare();
  }

}