const currencyBtn = document.querySelector("#currencyBtn");
const currencyAmount = document.querySelector("#currencyAmount");
const currencyFrom = document.querySelector("#currencyFrom");
const currencyTo = document.querySelector("#currencyTo");
const currencyResultIn = document.querySelectorAll(".main__p--userConvert")[0];
const currencyResultOut = document.querySelectorAll(".main__p--userConvert")[1];



//!Events
eventListeners ();
function eventListeners () {

	currencyBtn.disabled = true;
	validConverter();

	//!Currency 1 Select
	currencyFrom.addEventListener("change", () => {
		validConverter ()
	}),

	//!Currency 2 Select
	currencyTo.addEventListener("change", () => {
		validConverter ()
	}),

	//!Amount
	currencyAmount.addEventListener("input", () => {
		validConverter ()
	}),

	//!SubmitBtn
	currencyBtn.addEventListener("click", (e) => {
		e.preventDefault;
		submitConverterBtn()
	})
}

//!Validate multiple
function validConverter () {
	if (currencyFrom.value !== currencyTo.value && currencyAmount.valueAsNumber > 0){
		currencyBtn.disabled = false;
	}else (currencyBtn.disabled = true);
}

//!Submit converter Btn after validation
function submitConverterBtn (){

	let FromSelectCurrency = currencyTo.options[currencyTo.value].textContent
	let FromToCurrency = currencyFrom.options[currencyFrom.value].textContent
	let url = `https://alpha-vantage.p.rapidapi.com/query?from_currency=${FromSelectCurrency}&function=CURRENCY_EXCHANGE_RATE&to_currency=${FromToCurrency}`
	const options = {
		method: 'GET',
		headers: {
			'X-RapidAPI-Key': 'cc578b2a9cmshc1f63330b18b256p170242jsn98259ccb42b7',
			'X-RapidAPI-Host': 'alpha-vantage.p.rapidapi.com'
		}
	}

	currencyBtn.disabled = true

	fetch(url, options)
	.then(response => response.json())
	.then(response => currencyConverter(Object.values(response) [0]))
	.catch(err => console.error(err));
}

//!Alert
function alertUi(text, type) {
    Toastify({
        text: text,
        duration: 3000,
        newWindow: true,
        close: false,
        gravity: 'bottom', // `top` or `bottom`
        position: 'center', // `left`, `center` or `right`
        stopOnFocus: true, // Prevents dismissing of toast on hover
        className: type,
        onClick: function () {}, // Callback after click
    }).showToast();
}

//! Currency converter, spinner and innerHTML
function currencyConverter (data) {

	let FromSelectCurrency = currencyTo.options[currencyTo.value].textContent
	let FromToCurrency = currencyFrom.options[currencyFrom.value].textContent
	let currencyConverted = Number(Object.values(data)[4])*currencyAmount.valueAsNumber
	let currencyConvertedFixed = currencyConverted.toFixed(2)	
	let resultContentIn = `Ingreso de Dinero: ${currencyAmount.valueAsNumber} ${FromSelectCurrency}.`
	let resultContentOut = `Egreso de Dinero: ${currencyConvertedFixed} ${FromToCurrency}`

	// resultContentIn.innerHTML = `
	// 	<div class="lds-dual-ring"></div>
	// `
	alertUi('Cargando...', 'success');

	setTimeout(() => {
		currencyResultIn.textContent = resultContentIn
		currencyResultOut.textContent = resultContentOut
	}, 3000);
}