const amountIn = document.querySelector('#amount');
const months = document.querySelector('#months');
const amountUser = document.querySelector('#amountUser');

const resetBtn = document.querySelector('#resetBtn');
const submitBtn = document.querySelector('#submitBtn');
const amountUi = document.querySelector('#amountTotal');
const anualBalanceUi = document.querySelector('#anualBalance');
const anualAmountUi = document.querySelector('#anualAmount');
const anualTotalUi = document.querySelector('#anualTotal');

const balanceUi = document.querySelector('#balance');
const totalUi = document.querySelector('#totalIn');
const userTextUi = document.querySelector('#userTextUi');

const monthKeys = [
    'january',
    'february',
    'march',
    'april',
    'may',
    'june',
    'july',
    'august',
    'september',
    'october',
    'november',
    'december',
];

const monthsObject = Object.fromEntries(monthKeys.map((month) => [month, new UserInfo()]));

function formatCurrency(value) {
    return new Intl.NumberFormat('es-UY', {
        style: 'currency',
        currency: 'USD',
        maximumFractionDigits: 2,
    }).format(Number(value) || 0);
}

function getSelectedMonth() {
    if (months.value === '' || Number(months.value) < 0 || Number(months.value) > 11) {
        return null;
    }

    return monthsObject[monthKeys[Number(months.value)]];
}

function UserInfo() {
    this.text = '';
    this.amount = 0;
    this.amountUser = 0;
    this.balance = 0;
    this.total = 0;

    this.balanceFn = function () {
        this.total += this.amount;
        this.balance = this.amountUser - this.total;
        this.printUi();
    };

    this.printUi = function () {
        balanceUi.textContent = formatCurrency(this.balance);
        amountUi.textContent = formatCurrency(this.amountUser);
        totalUi.textContent = formatCurrency(this.total);

        const summary = Object.values(monthsObject).reduce(
            (acc, month) => {
                acc.balance += month.balance;
                acc.amount += month.amountUser;
                acc.total += month.total;
                return acc;
            },
            { balance: 0, amount: 0, total: 0 }
        );

        anualBalanceUi.textContent = formatCurrency(summary.balance);
        anualAmountUi.textContent = formatCurrency(summary.amount);
        anualTotalUi.textContent = formatCurrency(summary.total);
    };

    this.reset = function () {
        this.amount = 0;
        this.amountUser = 0;
        this.balance = 0;
        this.total = 0;
        this.printUi();
    };
}

eventListener();
function eventListener() {
    submitBtn.disabled = true;
    amountUser.disabled = true;
    amountIn.disabled = true;

    monthsLS();

    months.addEventListener('change', (event) => {
        const monthsObj = getSelectedMonth();

        if (!monthsObj) {
            amountUser.disabled = true;
            amountIn.disabled = true;
            submitBtn.disabled = true;
            return;
        }

        const selectedIndex = Number(event.target.value);
        const monthLabel = event.target.options[selectedIndex].textContent;
        monthsObj.text = monthLabel;

        amountUser.disabled = false;
        amountIn.disabled = monthsObj.amountUser <= 0;
        submitBtn.disabled = true;

        addElements(selectedIndex, monthsObj, monthLabel);
        monthsObj.printUi();
        amountUser.value = monthsObj.amountUser || '';
        amountIn.value = '';

        if (monthsObj.total > 0) {
            amountUser.disabled = true;
            amountIn.disabled = false;
        }
    });

    amountUser.addEventListener('input', () => {
        const monthsObj = getSelectedMonth();
        const income = Number(amountUser.value);

        if (!monthsObj) {
            return;
        }

        if (!Number.isFinite(income) || income <= 0) {
            alertUi('Ingrese un ingreso mensual válido.', 'error');
            amountIn.disabled = true;
            submitBtn.disabled = true;
            return;
        }

        monthsObj.amountUser = income;
        monthsObj.balance = income - monthsObj.total;
        amountIn.disabled = false;
    });

    amountIn.addEventListener('input', () => {
        const expense = Number(amountIn.value);
        const monthsObj = getSelectedMonth();

        if (!monthsObj) {
            return;
        }

        if (!Number.isFinite(expense) || expense < 1 || expense > monthsObj.balance) {
            alertUi('El gasto debe ser mayor a 0 y no puede superar el saldo disponible.', 'error');
            submitBtn.disabled = true;
            return;
        }

        monthsObj.amount = expense;
        amountUser.disabled = true;
        submitBtn.disabled = false;
    });

    submitBtn.addEventListener('click', (event) => {
        event.preventDefault();

        const monthsSelected = Number(months.value);
        const monthsObj = getSelectedMonth();

        if (!monthsObj) {
            alertUi('Seleccione un mes antes de confirmar.', 'error');
            return;
        }

        monthsObj.balanceFn();
        amountIn.value = '';
        submitBtn.disabled = true;
        months.disabled = false;

        localStorage.setItem(String(monthsSelected), JSON.stringify(monthsObj));

        alertUi('Gasto agregado correctamente.', 'success');
        addElements(monthsSelected, monthsObj, monthsObj.text);
    });

    resetBtn.addEventListener('click', () => {
        const confirmed = confirm('¿Desea eliminar todos los montos guardados?');
        if (confirmed) {
            localStorage.clear();
            document.location.reload();
        }
    });

    userTextUi.addEventListener('click', (event) => {
        const { value } = event.target;
        if (value === undefined) {
            return;
        }

        const monthIndex = Number(value);
        const monthsObj = monthsObject[monthKeys[monthIndex]];
        const confirmed = confirm(`¿Desea eliminar los montos de ${monthsObj.text || 'este mes'}?`);

        if (confirmed) {
            monthsObj.reset();
            addElements(monthIndex, monthsObj, monthsObj.text || 'Mes sin seleccionar');
            months.selectedIndex = 0;
            localStorage.setItem(String(monthIndex), JSON.stringify(monthsObj));
            amountUser.value = '';
            amountIn.value = '';
            amountUser.disabled = true;
            amountIn.disabled = true;
        }
    });
}

function alertUi(text, type) {
    Toastify({
        text,
        duration: 3000,
        newWindow: true,
        close: false,
        gravity: 'bottom',
        position: 'right',
        stopOnFocus: true,
        className: type,
    }).showToast();
}

function addElements(index, monthData, monthLabel) {
    const ui = userTextUi.children[index];
    const { amountUser: income, total, balance } = monthData;

    ui.innerHTML = `
        <h3 class="main__h3--months">${monthLabel}</h3>
        <p class="main__p--months">Total de ingresos:</p>
        <p class="main__p--monthsTotal">${formatCurrency(income)}</p>
        <p class="main__p--months">Total de gastos:</p>
        <p class="main__p--monthsTotal">${formatCurrency(total)}</p>
        <p class="main__p--months">Disponible para ahorro:</p>
        <p class="main__p--monthsTotal">${formatCurrency(balance)}</p>
        <button class="main__button--resetBtn" type="button" value="${index}">Limpiar mes</button>
    `;
}

function monthsLS() {
    monthKeys.forEach((monthKey, index) => {
        const storedValue = localStorage.getItem(String(index));
        if (!storedValue) {
            return;
        }

        try {
            const monthJson = JSON.parse(storedValue);
            const monthsObj = monthsObject[monthKey];

            monthsObj.text = monthJson.text || '';
            monthsObj.amount = Number(monthJson.amount) || 0;
            monthsObj.amountUser = Number(monthJson.amountUser) || 0;
            monthsObj.balance = Number(monthJson.balance) || 0;
            monthsObj.total = Number(monthJson.total) || 0;
            monthsObj.printUi();
            addElements(index, monthsObj, monthsObj.text || 'Mes sin seleccionar');
        } catch (error) {
            console.warn(`No se pudo recuperar el mes ${index} desde localStorage.`, error);
        }
    });
}
