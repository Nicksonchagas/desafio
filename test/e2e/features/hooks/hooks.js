const wait_sec = 3500;
const { BeforeAll, Before, After, Status, AfterAll } = require("cucumber");
const Common = require('../../page_objects/common/common_po')
const common = new Common()

BeforeAll({ timeout: 60 * wait_sec }, async function () {

    browser.driver.manage().window().maximize()
    browser.driver.getSession().then(function (session) {
        console.log(session.getId());
    });
    console.log("\nStarting the test execution ....")
});

Before(async function (scenario) {
  
    console.log("Iniciando o Cenário:", scenario.pickle.name)

   
});

After(async function (scenario) {
    let world = this;

    if (process.env.TEST_ENV === 'CI') {
        browser.manage().addCookie({
            name: 'zaleniumTestPassed',
            value: scenario.result.status === Status.FAILED ? 'false' : 'true'
        });
    }

    if (scenario.result.status === Status.FAILED) {
        await browser.takeScreenshot().then(function (buffer) {
            return world.attach(buffer, "image/png");
        });
    }
});


