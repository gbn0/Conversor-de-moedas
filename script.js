const apiUrl = 'https://openexchangerates.org/api/latest.json?app_id=9ed905c6f16e4836a3832a63d5b929e6';

const fromAmountInput = document.getElementById('fromAmountInput');
const toAmountInput = document.getElementById('toAmountInput');
const MoedaInSelect = document.getElementById('MoedaInSelect');
const MoedaOutSelect = document.getElementById('MoedaOutSelect');

let taxas = {};
let MoedaIn = '';
let MoedaOut = '';

// Event listeners
MoedaInSelect.addEventListener('change', handleMudarMoeda);
MoedaOutSelect.addEventListener('change', handleMudarMoeda);
fromAmountInput.addEventListener('input', updateConversao);




function inverterMoedas() {

    MoedaIn = MoedaInSelect.value;
    MoedaOut = MoedaOutSelect.value;

    MoedaInSelect.value = MoedaOut;
    MoedaOutSelect.value = MoedaIn;

    handleMudarMoeda();
}

function carregarMoedas(moedas) {
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

function handleMudarMoeda() {
    MoedaIn = MoedaInSelect.value;
    MoedaOut = MoedaOutSelect.value;

    if (MoedaIn === MoedaOut) {
        toAmountInput.value = fromAmountInput.value;
        return;
    }

    updateConversao();
}


function updateConversao() {
    const fromAmount = fromAmountInput.value;

    // Verifica se as taxas de câmbio foram carregadas
    if (!taxas || !taxas[MoedaIn] || !taxas[MoedaOut]) {
        console.error('Taxas de câmbio não carregadas corretamente.');
        return;
    }

    const taxaIn = taxas[MoedaIn];
    const taxaOut = taxas[MoedaOut];
    const toAmount = fromAmount * (taxaOut / taxaIn);

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