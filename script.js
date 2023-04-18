const apiUrl = 'https://openexchangerates.org/api/latest.json?app_id=9ed905c6f16e4836a3832a63d5b929e6';

//Elementos do DOM, ou seja, pegando os elementos do HTML
const fromAmountInput = document.getElementById('fromAmountInput');
const toAmountInput = document.getElementById('toAmountInput');
const MoedaInSelect = document.getElementById('MoedaInSelect');
const MoedaOutSelect = document.getElementById('MoedaOutSelect');

//Outras variáveis
let taxas = {};
let MoedaIn = '';
let MoedaOut = '';

//EventListeners para mudar o valor automaticamente toda vez que mudar a moeda ou o valor de input
MoedaInSelect.addEventListener('change', handleMudarMoeda);
MoedaOutSelect.addEventListener('change', handleMudarMoeda);
fromAmountInput.addEventListener('input', updateConversao);

//Função do botão de inverter as moedas
function inverterMoedas() {

    //Guarda os valores de cada moeda selecionada
    MoedaIn = MoedaInSelect.value;
    MoedaOut = MoedaOutSelect.value;

    //Inverte os valores
    MoedaInSelect.value = MoedaOut;
    MoedaOutSelect.value = MoedaIn;

    handleMudarMoeda();
}

//Função para carregar as moedas obtidas do fetch nos selects
function carregarMoedas(moedas) {
    //Cria uma opção para cada uma das taxas e coloca dentro dos selects com o appendChild
    const options = Object.keys(moedas);
    options.forEach(option => {
        const fromOption = document.createElement('option');
        const toOption = document.createElement('option');
        fromOption.textContent = option;
        toOption.textContent = option;
        MoedaInSelect.appendChild(fromOption);
        MoedaOutSelect.appendChild(toOption);
    });
}

//Função para atualizar a moeda quando troca a selecionada no select
function handleMudarMoeda() {
    //Pega as moedas que estão selecionadas para pegar as suas respectivas taxas depois
    MoedaIn = MoedaInSelect.value;
    MoedaOut = MoedaOutSelect.value;

    //Verifica se a moeda de entrada é a mesma de saída
    if (MoedaIn === MoedaOut) {
        toAmountInput.value = fromAmountInput.value;
        return;
    }

    updateConversao();
}

//Função que calcula a conversão
function updateConversao() {
    const fromAmount = fromAmountInput.value;

    //Verifica se as taxas foram carregadas corretamente
    if (!taxas || !taxas[MoedaIn] || !taxas[MoedaOut]) {
        console.error('Taxas de câmbio não carregadas corretamente.');
        return;
    }

    //Pega as taxas e faz a conversão
    const taxaIn = taxas[MoedaIn];
    const taxaOut = taxas[MoedaOut];
    const toAmount = fromAmount * (taxaOut / taxaIn);

    //Limita as casas decimais para 2
    toAmountInput.value = toAmount.toFixed(2);
}


// Chama a API da Open Exchange Rates para obter as opções de moedas e as taxas de câmbio
fetch(apiUrl)
    .then(response => response.json())
    .then(data => {
        taxas = data.rates;
        carregarMoedas(taxas);
        handleMudarMoeda();
    })
    .catch(error => {
        console.error('Erro ao obter as moedas:', error);
    });