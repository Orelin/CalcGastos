const currencyBtn = document.querySelector("#currencyBtn");
const currencyAmount = document.querySelector("#currencyAmount");
const currencyFrom = document.querySelector("#currencyFrom");
const currencyTo = document.querySelector("#currencyTo");
const currencyResult = document.querySelector("#currencyResult");
const FromSelectCurrency = currencyFrom.options[currencyFrom.value].textContent
const FromToCurrency = currencyTo.options[currencyTo.value].textContent


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

	const url = `https://alpha-vantage.p.rapidapi.com/query?from_currency=${FromSelectCurrency}&function=CURRENCY_EXCHANGE_RATE&to_currency=${FromToCurrency}`
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

//! Currency converter, spinner and innerHTML
function currencyConverter (data) {

	console.log("Desde function currencyConverter", data);
	let currencyAmountRate = currencyAmount.valueAsNumber
	const FromSelectCurrency = currencyFrom.options[currencyFrom.value].textContent
	const FromToCurrency = currencyTo.options[currencyTo.value].textContent
	const currencyConverted = Number(Object.values(data)[4])*currencyAmount.valueAsNumber; 
	
	let resultContent = `Ingreso de Dinero: ${currencyAmount.valueAsNumber} ${FromSelectCurrency}. Egreso de Dinero ${currencyConverted} ${FromToCurrency}`

	currencyResult.innerHTML = `
		<div class="lds-dual-ring"></div>
	`

	setTimeout(() => {
		currencyResult.textContent = resultContent
	}, 5000);
}