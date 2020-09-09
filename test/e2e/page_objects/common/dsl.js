const expect = require('chai').use(require('chai-as-promised')).expect
const EC = protractor.ExpectedConditions;
let Buffer = require('safe-buffer').Buffer

let util = require('util')

let _ = require('lodash');
let dataObject = {};

class Dsl {

  openUrl(url) {
    return browser.get(url);
  }

  sendKeys(element, value, logText, key) {
    if (value) {
      this.waitVisibilityOf(element, 10000, logText);

      if (key)
        this.updateDataObject(key, value)

      logText = logText || 'Function sendKeys:';

      return element.sendKeys(value).then((found) => Promise.resolve(found))
        .catch((waitError) => {
          var log = this.logTextFormatted(logText, waitError, element)
          return Promise.reject(log);
        });
    }
  }

  sendkeysBack(element, value, log, key) {
    this.click(element)
    return this.sendKeys(element, protractor.Key.BACK_SPACE + value, log, key)
  }

  slowSendKeys(element, value, delay, log) {
    for (var i = 0; i < value.length; i++) {
      this.sendKeys(element, value[i], log)
      this.sleep(delay)
    }
  }

  click(element, time, logText, key, value) {

    time = time || 10000;
    this.waitElementToBeClickable(element, time, logText);
    logText = logText || 'Function click:';

    if (key)
      this.updateDataObject(key, value)

    return element.click().then((found) => Promise.resolve(found))
      .catch((waitError) => {
        var log = this.logTextFormatted(logText, waitError, element);
        return Promise.reject(log);
      });
  }

  

  waitToBeDisplayed(target, timeout) {
    let e = target;
    return browser.wait(() => {
      e = target;
      return e.isPresent().then((value) => {
        if (!value) {
          return false;
        }
        return e.isDisplayed();
      }, () => false).then((value) => value, () => false);
    },
      timeout,
      `Elemento ${e.locator()} não está presente ou visivel`
    );
  }

  
  clickAndSearch(webElement, value, log, key, tryCount) {
    if (value) {
      if (key)
        this.updateDataObject(key, value)

      this.sendKeys(webElement, value, log, key);
      const clickOption = this.webElement('xpath', `//div[contains(@id,'-option-')][text()='${value}']`);

      if (tryCount == null && tryCount == undefined)
        tryCount = 1;

      if (key)
        this.updateDataObject(key, value)

      return this.waitToBeDisplayed(clickOption, 10000).then(() => {
        return browser.wait(ExpectedConditions.elementToBeClickable(clickOption), 10000, `Elemento ${clickOption.locator()} não está clicável`);
      }).then(() => clickOption.click()).then(
        () => { }, (error) => {
          if (tryCount > 0) {
            console.log(`Erro ao realizar o Click : ${error}`);
            console.log(`Realizando Click retry ${tryCount} no elemento ${clickOption.locator()}`);
            tryCount = tryCount - 1;
            webElement.sendKeys(protractor.Key.ESCAPE)
            this.clickAndSearch(webElement, value, log, key, tryCount);
          } else {
            console.error(`Erro ao tentar clicar no elemento ${clickOption.locator()}`);
            throw error;
          }
        }
      );
    }
  }

  slowClickAndSearch(webElement, value, log, key, tryCount) {
    if (key)
      this.updateDataObject(key, value)

    this.slowSendKeys(webElement, value, 100, log, key);
    const clickOption = this.webElement('xpath', `//div[contains(@id,'-option-')][text()='${value}']`);

    if (tryCount == null && tryCount == undefined)
      tryCount = 1;

    return browser.wait(
      ExpectedConditions.elementToBeClickable(clickOption), 10000, `Elemento ${clickOption.locator()} não está clicável`)
      .then(() => clickOption.click()).then(
        () => { }, (error) => {
          if (tryCount > 0) {
            console.log(`Erro ao realizar o Click : ${error}`);
            console.log(`Realizando Click retry ${tryCount} no elemento ${clickOption.locator()}`);
            tryCount = tryCount - 1;
            webElement.sendKeys(protractor.Key.BACK_SPACE + '')
            this.slowClickAndSearch(webElement, value, log, key, tryCount);
          } else {
            console.error(`Erro ao tentar clicar no elemento ${clickOption.locator()}`);
            throw error;
          }
        }
      );
  }

  clickAndSearchNoSendKeys(webElement, value, log, key, tryCount) {

    if (key)
      this.updateDataObject(key, value);

    const clickOption = this.webElement('xpath', `//div[contains(@id,'-option-')][text()='${value}']`);

    if (tryCount == null && tryCount == undefined)
      tryCount = 1;

    return browser.wait(
      ExpectedConditions.elementToBeClickable(clickOption), 10000, `Elemento ${clickOption.locator()} não está clicável`)
      .then(() => clickOption.click()).then(
        () => { }, (error) => {
          if (tryCount > 0) {
            console.log(`Erro ao realizar o Click : ${error}`);
            console.log(`Realizando Click retry ${tryCount} no elemento ${clickOption.locator()}`);
            tryCount = tryCount - 1;
            webElement.sendKeys(protractor.Key.BACK_SPACE + '')
            this.clickAndSearchNoSendKeys(webElement, value, log, tryCount);
          } else {
            console.error(`Erro ao tentar clicar no elemento ${clickOption.locator()}`);
            throw error;
          }
        }
      );

  }


  select(element, option, logText) {
    this.waitVisibilityOf(element, 10000, logText);

    logText = logText || 'Function select';

    return element.select(option).then((found) => Promise.resolve(found))
      .catch((waitError) => {
        var log = this.logTextFormatted(logText, waitError, element);
        return Promise.reject(log);
      });
  }

  getText(element, logText) {

    this.waitVisibilityOf(element, 10000, logText);
    logText = logText || 'Function getText';
    return element.getText().then((found) => Promise.resolve(found))
      .catch((waitError) => {
        var log = this.logTextFormatted(logText, waitError, element);
        return Promise.reject(log);
      });
  }

  getAttribute(element, attributeName) {
    return browser.wait(function () {
      return element.getAttribute(attributeName).then(function (value) {
        return value;
      });
    });
  }

  waitVisibilityOf(element, maxWaitTime, logText) {
    logText = logText || 'Function waitVisibilityOf';
    maxWaitTime = maxWaitTime || 20000;
    return browser.wait(ExpectedConditions.visibilityOf(element), maxWaitTime)
      .then((found) => Promise.resolve(found))
      .catch((waitError) => {
        var log = this.logTextFormatted(logText, waitError, element)
        return Promise.reject(log);
      });
  }

  waitElementToBeClickable(element, maxWaitTime, logText) {
    logText = logText || 'Function waitVisibilityOf';
    maxWaitTime = maxWaitTime || 20000;
    return browser.wait(ExpectedConditions.elementToBeClickable(element), maxWaitTime)
      .then((found) => Promise.resolve(found))
      .catch((waitError) => {
        var log = this.logTextFormatted(logText, waitError, element)
        return Promise.reject(log);
      });
  }

  waitInvisibilityOf(element, maxWaitTime, logText) {
    logText = logText || 'Function waitInvisibilityOf';
    maxWaitTime = maxWaitTime || 10000;
    return browser.wait(EC.invisibilityOf(element), maxWaitTime).then((found) => Promise.resolve(found))
      .catch((waitError) => {
        var log = this.logTextFormatted(logText, waitError, element);
        return Promise.reject(log);
      });
  }

  expectIsElementPresent(element, log) {
    log = log || '';
    (log);
    return expect(element(element).isPresent()).to.eventually.equals(true, log);
  }

  expectIsElementNotPresent(element, log) {
    log = log || '';
    return expect(element(element).isPresent()).to.eventually.equals(false, log);
  }

  expectAttributePresent(element, attribute, log) {
    log = log || '';
    return expect(element(element).getAttribute(attribute)).to.eventually.equals(true, log);
  }

  expectTextToBeEqual(element, value) {
    return expect(this.getText(element)).to.eventually.equal(value);
  }

  sleep(time) {
    return browser.sleep(time)
  }

  scrollTo(scrollToElement) {
    var wd = browser.driver;
    return scrollToElement.getLocation().then((loc) => {
      return wd.executeScript('window.scrollTo(0,arguments[0]);', loc.y);
    });
  };

  webElement(type, txtElement) {

    if (this.areEqual(type, 'css'))
      return element(by.css(txtElement));
    else if (this.areEqual(type, 'xpath'))
      return element(by.xpath(txtElement));
    else if (this.areEqual(type, 'id'))
      return element(by.id(txtElement));
    else if (this.areEqual(type, 'name'))
      return element(by.name(txtElement));

  }

  areEqual(var1, var2) {
    return var1.toUpperCase() === var2.toUpperCase();
  }

  logTextFormatted(logText, waitError, element) {
    return `${logText} ${waitError} for the element: ${this.convertWebElementToString(element)}`
  }

  convertWebElementToString(element) {
    try {
      return util.inspect(element).toString().split('value: \'')[1].split('\' },')[0]
    } catch (e) {
      //console.log(util.inspect(element).toString())

    }
  }

  concatString(strings, separator) {
    let a = "";
    let b = "";
    strings = strings.sort()
    for (let index = 0; index <= strings.length - 1; index++) {
      if (strings[index] !== "") {
        b = `${strings[index].trim()}${separator}`;
        if (index == strings.length - 1)
          b = b.replace(separator, "")
        a = a + b
      } else if (strings[index] === "" && index === strings.length - 1)
        a = a.replace(new RegExp(`${separator}$`), "")

    }
    return a;
  }
}
module.exports = Dsl
