#language: pt
Funcionalidade: Validação de produtos no carrinho

Contexto: Realizar inclusão de produtos no carrinho
        Dado que um cliente acessa o site das casas bahia

@buscaProdutos @carrinho
Cenário: CT01_Adicionar um Iphone no carrinho
        Dado que realiza pesquisa na página principal por um iphone xr
        E seleciona um iphone xr na lista de resultados
        Quando clicar no botão comprar
        Então o iphone será incluso no carrinho 

