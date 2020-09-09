'use strict';


const { Given, When, Then } = require('cucumber');

const Common = require('../../page_objects/common/common_po');

const common = new Common();


Given('que um cliente acessa o site das casas bahia', { timeout: 60 * 1500 }, async () => {
    await common.openUrl();
});

Given('que realiza pesquisa na página principal por um iphone xr', async () => {
    await common.searchProducts('iphone xr');
});

Given('seleciona um iphone xr na lista de resultados', async () => {
    await common.selectProductFirst();
});

When('clicar no botão comprar', async () => {
    await common.addProductToCart();
});

Then('o iphone será incluso no carrinho', async () => {
    
    await common. validateCartProduct('iPhone XR');
});



