
frameworks = {
  //serverIntegration: new ServerIntegrationTestFramework(),
  clientIntegration: new ClientIntegrationTestFramework(),
  clientUnit: new ClientUnitTestFramework(),
  serverUnit: new ServerUnitTestFramework()
}

if (process.env.VELOCITY !== '0' and !process.env.IS_MIRROR) {
  frameworks.clientIntegration.registerWithVelocity()
  frameworks.clientIntegration.startFileCopier()

  frameworks.clientUnit.registerWithVelocity()

  frameworks.serverUnit.registerWithVelocity()

  Meteor.startup(function () {
    //frameworks.serverIntegration.runTests()
    frameworks.clientUnit.start()
    frameworks.serverUnit.start()
  })
}
