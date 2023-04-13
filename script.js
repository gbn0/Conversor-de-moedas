// URL da API da Open Exchange Rates
const apiUrl = 'https://openexchangerates.org/api/latest.json?app_id=9ed905c6f16e4836a3832a63d5b929e6';

// Elementos do DOM
const fromAmountInput = document.getElementById('fromAmountInput');
const toAmountInput = document.getElementById('toAmountInput');
const fromCurrencySelect = document.getElementById('fromCurrencySelect');
const toCurrencySelect = document.getElementById('toCurrencySelect');

// Variáveis de conversão de moedas
let exchangeRates = {}; // Objeto para armazenar as taxas de câmbio
let fromCurrency = ''; // Moeda de origem
let toCurrency = ''; // Moeda de destino

// Event listeners
fromCurrencySelect.addEventListener('change', handleCurrencyChange);
toCurrencySelect.addEventListener('change', handleCurrencyChange);
fromAmountInput.addEventListener('input', updateConversion);




function invertCurrencies() {
    // Obtenha o valor atual de cada select
    var fromCurrencySelect = document.getElementById('fromCurrencySelect');
    var toCurrencySelect = document.getElementById('toCurrencySelect');

    // Obtem os valores
    var fromCurrency = fromCurrencySelect.value;
    var toCurrency = toCurrencySelect.value;

    // Inverte os valores
    fromCurrencySelect.value = toCurrency;
    toCurrencySelect.value = fromCurrency;

    handleCurrencyChange();
}

// Carrega os tipos de moeda nos selects
function loadCurrencyOptions(currencies) {
    const options = Object.keys(currencies);
    options.forEach(option => {
        const fromOption = document.createElement('option');
        const toOption = document.createElement('option');
        fromOption.textContent = option;
        toOption.textContent = option;
        fromCurrencySelect.appendChild(fromOption);
        toCurrencySelect.appendChild(toOption);
    });
}

// Função pra quando muda a moeda selecionada
function handleCurrencyChange() {
    fromCurrency = fromCurrencySelect.value;
    toCurrency = toCurrencySelect.value;

    // Vê se a mesma moeda foi selecionada dos 2 lados
    if (fromCurrency === toCurrency) {
        toAmountInput.value = fromAmountInput.value;
        return;
    }

    updateConversion();
}


// Função para atualizar a conversão de moedas
function updateConversion() {
    const fromAmount = fromAmountInput.value;

    // Verifica se as taxas de câmbio foram carregadas
    if (!exchangeRates || !exchangeRates[fromCurrency] || !exchangeRates[toCurrency]) {
        console.error('Taxas de câmbio não carregadas corretamente.');
        return;
    }

    const fromRate = exchangeRates[fromCurrency];
    const toRate = exchangeRates[toCurrency];
    const toAmount = fromAmount * (toRate / fromRate);

    // Atualiza o valor na caixa de resultado
    toAmountInput.value = toAmount.toFixed(2);
}


// Chama a API da Open Exchange Rates para obter as opções de moedas e as taxas de câmbio
fetch(apiUrl)
    .then(response => response.json())
    .then(data => {
        exchangeRates = data.rates;
        loadCurrencyOptions(exchangeRates); // Chama a função para carregar as opções de moedas nos seletores
        handleCurrencyChange(); // Chama a função para atualizar a conversão de moedas
    })
    .catch(error => {
        console.error('Erro ao obter as moedas:', error);
    });