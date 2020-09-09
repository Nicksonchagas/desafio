
const expect = require('chai').use(require('chai-as-promised')).expect
const dateFormat = require('dateformat');
const Dsl = require('./dsl')
const dsl = new Dsl()

const WebElements = require('./webElements')
const faker = require('faker');

const commonElements = new WebElements.commonPage();


class commonPage {
  constructor() { Dsl.prototype.current = dsl }

  openUrl() {
    return browser.get('/');
  }

  searchProducts(product) {
    dsl.sendKeys(commonElements.inputPrincipalSearch(), product, 'BUSCA: Erro ao informar produto');
    return dsl.click(commonElements.btnSearch(), 1000, 'BUSCA: Erro ao realizar busca pelo produto');
  }

  selectProductFirst() {

    return dsl.click(commonElements.cardOptionFirst(), 1000, 'BUSCA: Erro ao selecionar o primeiro produto');
  }

  addProductToCart() {

    return dsl.click(commonElements.btnAddProductToCart(), 1000, 'BUSCA: Erro ao adicionar produto ao carrinho');
  }

  validateCartProduct(product) {

    return dsl.waitVisibilityOf(commonElements.lblCartProduct(product), 1000, 'CARRINHO DE COMPRAS: Erro ao validar item no carrinho de compras');
  }

}
module.exports = commonPage