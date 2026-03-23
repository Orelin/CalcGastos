const currencyBtn = document.querySelector('#currencyBtn');
const currencyAmount = document.querySelector('#currencyAmount');
const currencyFrom = document.querySelector('#currencyFrom');
const currencyTo = document.querySelector('#currencyTo');
const currencyResultIn = document.querySelectorAll('.main__p--userConvert')[0];
const currencyResultOut = document.querySelectorAll('.main__p--userConvert')[1];
const currencyMeta = document.querySelector('#currencyMeta');

const currencyCodeMap = ['USD', 'UYU', 'EUR', 'MXN', 'RUB', 'CAD', 'CLP'];
const exchangeRateApiBaseUrl = 'https://open.er-api.com/v6/latest';

initCurrencyConverter();

function initCurrencyConverter() {
    currencyBtn.disabled = true;
    validConverter();

    currencyFrom.addEventListener('change', validConverter);
    currencyTo.addEventListener('change', validConverter);
    currencyAmount.addEventListener('input', validConverter);
    currencyBtn.addEventListener('click', async (event) => {
        event.preventDefault();
        await submitConverterBtn();
    });
}

function validConverter() {
    currencyBtn.disabled = !(currencyFrom.value !== currencyTo.value && currencyAmount.valueAsNumber > 0);
}

async function fetchExchangeRate(baseCurrency, targetCurrency) {
    const response = await fetch(`${exchangeRateApiBaseUrl}/${baseCurrency}`);

    if (!response.ok) {
        throw new Error(`No se pudo consultar la cotización (${response.status}).`);
    }

    const data = await response.json();

    if (data.result !== 'success') {
        throw new Error('El servicio de cotización devolvió una respuesta inválida.');
    }

    const rate = data.rates?.[targetCurrency];
    if (typeof rate !== 'number') {
        throw new Error(`No hay cotización disponible para ${baseCurrency} → ${targetCurrency}.`);
    }

    return {
        rate,
        updatedAt: data.time_last_update_utc,
        nextUpdateAt: data.time_next_update_utc,
    };
}

async function submitConverterBtn() {
    const fromCurrency = currencyCodeMap[Number(currencyFrom.value)];
    const toCurrency = currencyCodeMap[Number(currencyTo.value)];
    const amount = currencyAmount.valueAsNumber;

    currencyBtn.disabled = true;
    currencyResultIn.textContent = 'Cotizando...';
    currencyResultOut.textContent = '';
    currencyMeta.textContent = '';

    try {
        const { rate, updatedAt, nextUpdateAt } = await fetchExchangeRate(fromCurrency, toCurrency);
        currencyConverter({ fromCurrency, toCurrency, amount, rate, updatedAt, nextUpdateAt });
    } catch (error) {
        currencyResultIn.textContent = '';
        currencyResultOut.textContent = '';
        currencyMeta.textContent = error.message;
        alertUi(error.message, 'error');
    } finally {
        validConverter();
    }
}

function currencyConverter({ fromCurrency, toCurrency, amount, rate, updatedAt, nextUpdateAt }) {
    const convertedAmount = (amount * rate).toFixed(2);

    currencyResultIn.textContent = `${amount} ${fromCurrency}`;
    currencyResultOut.textContent = `${convertedAmount} ${toCurrency}`;
    currencyMeta.textContent = `Actualizado: ${updatedAt}. Próxima actualización estimada: ${nextUpdateAt}.`;
}
