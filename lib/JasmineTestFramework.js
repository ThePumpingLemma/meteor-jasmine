// definition of the global console reporter

if (Meteor.isServer) {
  var util = Npm.require('util'),
    jasmineRequire = Npm.require('jasmine-core/lib/jasmine-core/jasmine.js'),
    consoleFns = Npm.require('jasmine-core/lib/console/console.js');

  _.extend(jasmineRequire, consoleFns);

  var jasmine = jasmineRequire.core(jasmineRequire)
  jasmineRequire.console(jasmineRequire, jasmine);

  getJasmineConsoleReporter = function(searchString, showMessage) {
    // override original behavior to cut stack trace (dirty, in order not to modify the console)
    var consoleReporter = new jasmine.ConsoleReporter({
      print: util.print,
      showColors: true,
      timer: new jasmine.Timer()
    });

    var originalReport = consoleReporter.specDone;
    var that = this;
    consoleReporter.specDone = function(result) {
      if (result.status == "failed" && result.failedExpectations.length > 0) {
        // simplify stack trace
        for (var i = 0; i < result.failedExpectations.length; i++) {
          var failedExpectation = result.failedExpectations[i],
              reg = new RegExp(".*" + searchString + ".*"),
              match = failedExpectation.stack != null ? failedExpectation.stack.match(reg) : null;

          if (match != null && match.length > 0) {
            var stack = failedExpectation.stack.match(reg)[0].toString()
            failedExpectation.stack = "Error: " +
              failedExpectation.message + "\n" +
              (stack[0] === ' ' ? stack : ("  " + stack))
          }
        }
      }
      originalReport(result);
    }

    return consoleReporter;
  }
}

JasmineTestFramework = function (options) {
  if (!options || !options.name) {
    throw new Error("[JasmineTestFramework] Missing required field 'name'")
  }

  if (!options.regex) {
    throw new Error("[JasmineTestFramework] Missing required field 'regex'")
  }

  if (_.isUndefined(options.jasmineRequire)) {
    throw new Error("[JasmineTestFramework] Missing required field 'jasmineRequire'")
  }

  this.name = options.name
  this.regex = options.regex
  this.logPrefix = options.logPrefix || '[' + this.name + '] '
  this.jasmineRequire = options.jasmineRequire

  // load jasmine-velocity reporter
  // [unit] mock packages

}

_.extend(JasmineTestFramework.prototype, {

  //////////////////////////////////////////////////////////////////////
  // Public functions
  //

  runTests: function () {},

  //////////////////////////////////////////////////////////////////////
  // Protected functions
  //

  registerWithVelocity: function () {
    Velocity.registerTestingFramework(this.name, {regex: this.regex})
  }

})
