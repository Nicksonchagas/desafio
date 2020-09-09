
const Dsl = require('./dsl');
const dsl = new Dsl();

class commonPage {
    inputPrincipalSearch() { return dsl.current.webElement('id', 'strBusca'); }
    btnSearch() { return dsl.current.webElement('id', 'btnOK'); }
    cardOptionFirst() { return dsl.current.webElement('xpath', "(//ul[contains(@class,'ProductsGrid')]//div[contains(@class,'ProductCard__Product')])[1]}"); }
    btnAddProductToCart() { return dsl.current.webElement('id', "btnAdicionarCarrinho"); }
    lblCartProduct(text) { return dsl.current.webElement('xpath', `//td[@class='produto']//strong[contains(text(),'${text}')]}}`); }
}

module.exports = {
    commonPage

}


