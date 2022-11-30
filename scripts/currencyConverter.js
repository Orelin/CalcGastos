const options = {
	method: 'GET',
	headers: {
		'X-RapidAPI-Key': 'cc578b2a9cmshc1f63330b18b256p170242jsn98259ccb42b7',
		'X-RapidAPI-Host': 'alpha-vantage.p.rapidapi.com'
	}
};

/*fetch('https://alpha-vantage.p.rapidapi.com/query?from_currency=USD&function=CURRENCY_EXCHANGE_RATE&to_currency=EUR', options)
	.then(response => response.json())
	.then(response => console.log(response))
	.catch(err => console.error(err));*/



const currencyBtn = document.querySelector("#currencyBtn");
const currencyAmount = document.querySelector("#currencyAmount");
const currencyFrom = document.querySelector("#currencyFrom");
const currencyTo = document.querySelector("#currencyTo");



currencyBtn.addEventListener("click", (e) => {
	e.preventDefault

	const FromSelectCurrency = currencyFrom.options[currencyFrom.value].textContent
	const FromToCurrency = currencyTo.options[currencyTo.value].textContent


	if (currencyAmount.valueAsNumber > 0) {

		const url = `https://alpha-vantage.p.rapidapi.com/query?from_currency=${FromSelectCurrency}&function=CURRENCY_EXCHANGE_RATE&to_currency=${FromToCurrency}`

		fetch(url, options)
			.then(response => response.json())
			.then(response => currencyConverter(Object.values(response) [0]))
			.catch(err => console.error(err));

	}



})


function currencyConverter (data) {

	
	console.log("Desde function currencyConverter", data);
	let currencyAmountRate = currencyAmount.valueAsNumber
	const FromSelectCurrency = currencyFrom.options[currencyFrom.value].textContent
	const FromToCurrency = currencyTo.options[currencyTo.value].textContent
	const rate = Number(Object.values(data)[4])*currencyAmount.valueAsNumber; 
	
	console.log(data);
	console.log(rate);

	console.log(`Invirtiendo ${currencyAmount.valueAsNumber} ${FromSelectCurrency} podra adquirir ${rate} ${FromToCurrency}`)


}



