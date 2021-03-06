ClientUnitTestFramework = function (options) {
  options = options || {}

  _.defaults(options, {
    name: 'jasmine-client-unit',
    regex: '^tests/jasmine/client/unit/.+\\.(js|coffee|litcoffee|coffee\\.md)$',
    jasmineRequire: null
  })

  JasmineTestFramework.call(this, options)
}

ClientUnitTestFramework.prototype = Object.create(JasmineTestFramework.prototype)

_.extend(ClientUnitTestFramework.prototype, {
  start: function () {
    var files = this._getPreAppFiles().concat(
      this._getAppFiles(),
      this._getHelperFiles(),
      this._getStubFiles(),
      this._getTestFiles()
    )

    var options = {
      port: 5050,
      basePath: Velocity.getAppPath(),
      frameworks: ['jasmine'],
      browsers: ['Chrome'],
      plugins: [
        'karma-jasmine',
        'karma-chrome-launcher'
      ],
      files: files
    }
    Karma.server.start(options)
    Meteor.setTimeout(function () {
      Karma.runner.run(options);
    }, 10000);
  },
  _getPreAppFiles: function () {
    return [
      this._getAssetPath('__meteor_runtime_config__.js')
    ]
  },
  _getAppFiles: function () {
    return _.chain(WebApp.clientPrograms['web.browser'].manifest)
      .filter(function (file) {
        return file.type === 'js' // TODO: Remove and serve all types correctly
      })
      .filter(function (file) {
        var ignoredFiles = [
          'packages/sanjo_jasmine.js',
          'packages/velocity_core.js',
          'packages/velocity_html-reporter.js'
        ]
        return !_.contains(ignoredFiles, file.path)
      })
      .map(function (file) {
        return '.meteor/local/build/programs/web.browser/' + file.path
      })
      .value()
  },
  _getHelperFiles: function () {
    return [
      this._getAssetPath('jasmine-jquery.js')
    ]
  },
  _getStubFiles: function () {
    return [

    ]
  },
  _getTestFiles: function () {
    // Use a match pattern directly.
    // That allows Karma to detect changes and rerun the tests.
    return [
      'tests/jasmine/client/unit/**/*.{js,coffee,litcoffee,coffee.md}'
    ]
  },
  _getAssetPath: function (fileName) {
    var assetsPath = '.meteor/local/build/programs/server/assets/packages/sanjo_jasmine/client/unit/assets/'
    return assetsPath + fileName;
  },
  generateKarmaConfig: function () {
    var karmaConfTemplate = Assets.getText('client/unit/karma.conf.js.tpl')
    var karmaConf = _.template(karmaConfTemplate, {
      DATE: new Date().toISOString(),
      BASE_PATH: '../../../../',
      FRAMEWORKS: "'jasmine'",
      FILES: 'TODO', // TODO: Read and order app files. And also add tests with wildcard.
      EXCLUDE: 'TODO',
      PREPROCESSORS: 'TODO',
      AUTO_WATCH: 'false',
      BROWSERS: "'Chrome'"
    })
    // TODO: Write file
    // TODO: Allow user to overwrite template
    // TODO: Read default config from karma.json
  }
});
