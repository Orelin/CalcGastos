const amountIn = document.querySelector("#amount");
const alerts = document.querySelector(".alerts");
const months = document.querySelector("#months");
const amountUser = document.querySelector("#amountUser");

const resetBtn = document.querySelector(".resetBtn");
const submitBtn = document.querySelector("#submitBtn");



const amountUi = document.querySelector(".amountTotal");
const balanceUi = document.querySelector(".balance");
const totalUi = document.querySelector(".totalIn");
const userTextUi = document.querySelector(".userTextUi");

const forms = document.querySelector(".forms");

const monthsObject = {
    january: new UserInfo(),
    february: new UserInfo(),
    march: new UserInfo(),
    april: new UserInfo(),
    may: new UserInfo(),
    june: new UserInfo(),
    july: new UserInfo(),
    august: new UserInfo(),
    september: new UserInfo(),
    october: new UserInfo(),
    november: new UserInfo(),
    december: new UserInfo(),
}



function UserInfo() {
    this.text = 0,
    this.amount = 0,
    this.amountUser = 0,
    this.balance = 0,
    this.balanceNeg = 0,
    this.total = 0,
    this.balanceFn = function () {
        this.total = this.total + this.amount,
        this.balance = this.amountUser - this.total,
        this.balanceNeg = this.amountUser-this.balance
        balanceUi.textContent = `$${this.balance}`,
        amountUi.textContent = `$${this.amountUser}`,
        totalUi.textContent = `$${this.total}`
    },

    this.printUi = function () {
        balanceUi.textContent = `$${this.balance}`,
        amountUi.textContent = `$${this.amountUser}`,
        totalUi.textContent = `$${this.total}`,
        amountUser.value = this.amountUser
    },

    this.reset = function () {
        this.amount = 0,
        this.amountUser = 0,
        this.balance = 0,
        this.balanceNeg = 0,
        this.total = 0,
        this.printUi();
    }
};


eventListener();
function eventListener() {

    forms.reset();
    submitBtn.disabled = true;
    amountUser.disabled = true;
    amountIn.disabled = true;



    //!Seleccion de Mes
    months.addEventListener("input", (g) => {


        let monthsObj = monthsObject[Object.keys(monthsObject)[months.value]];
        let monthsSelected = months.value;
        let monthsTextForm = g.target.options[months.value].textContent; //Mes seleccionado
        monthsObj.text = monthsTextForm;

        if (months.value < 12) {

            //months.disabled = true;
            amountUser.disabled = false

            switch (months.value) {
                case "0":
                    addElements(monthsSelected, monthsObj, monthsTextForm);
                    monthsObj.printUi();
                    amountIn.value = "";
                    break;
                case "1":
                    addElements(monthsSelected, monthsObj, monthsTextForm);
                    monthsObj.printUi();
                    amountIn.value = "";
                    break;
                case "2":
                    addElements(monthsSelected, monthsObj, monthsTextForm);
                    monthsObj.printUi();
                    amountIn.value = "";
                    break;
                case "3":
                    addElements(monthsSelected, monthsObj, monthsTextForm);
                    monthsObj.printUi();
                    amountIn.value = "";
                    break;
                case "4":
                    addElements(monthsSelected, monthsObj, monthsTextForm);
                    monthsObj.printUi();
                    amountIn.value = "";
                    break;
                case "5":
                    addElements(monthsSelected, monthsObj, monthsTextForm);
                    monthsObj.printUi();
                    amountIn.value = "";
                    break;
                case "6":
                    addElements(monthsSelected, monthsObj, monthsTextForm);
                    monthsObj.printUi();
                    amountIn.value = "";
                    break;
                case "7":
                    addElements(monthsSelected, monthsObj, monthsTextForm);
                    monthsObj.printUi();
                    amountIn.value = "";
                    break;
                case "8":
                    addElements(monthsSelected, monthsObj, monthsTextForm);
                    monthsObj.printUi();
                    amountIn.value = "";
                    break;
                case "9":
                    addElements(monthsSelected, monthsObj, monthsTextForm);
                    monthsObj.printUi();
                    amountIn.value = "";
                    break;
                case "10":
                    addElements(monthsSelected, monthsObj, monthsTextForm);
                    monthsObj.printUi();
                    amountIn.value = "";
                    break;
                case "11":
                    addElements(monthsSelected, monthsObj, monthsTextForm);
                    monthsObj.printUi();
                    amountIn.value = "";
                    break;
                default:
                    submitBtn.disabled = true;
                    
            }
        }
        if (monthsObj.total > 0){
            amountUser.disabled = true
            amountIn.disabled = false;
        } 
    })


    //!Total Ingresos del mes
    amountUser.addEventListener("input", () => {

        let monthsObj = monthsObject[Object.keys(monthsObject)[months.value]];
        monthsObj.amountUser = parseInt(amountUser.value)

        if (monthsObj.amountUser <= 0 || amountUser.value < amountIn.value || isNaN(monthsObj.amountUser)) {
            alertUi("Saldo mensual insuficiente", "error")
            amountIn.disabled = true;
        } else {
            monthsObj.amountUser = parseInt(amountUser.value);
            monthsObj.balance =+ monthsObj.amountUser;

            amountIn.disabled = false;
        }
    })


    //!Salida de Gastos
    amountIn.addEventListener("input", (e) => {
        let amounIn = parseInt(amountIn.value);
        let monthsObj = monthsObject[Object.keys(monthsObject)[months.value]];

        if (amounIn === undefined || isNaN(amounIn) || amounIn >= monthsObj.balance || amounIn < 0) {
            alertUi("El Saldo restante del mes es insuficiente", "error");
            submitBtn.disabled = true;
        } else {
            monthsObj.amount = amounIn;
            amountUser.disabled = true;
            submitBtn.disabled = false;
        };
    })


    //!Boton de Confirmar
    submitBtn.addEventListener("click", (e) => {
        e.preventDefault();

        let monthsObj = monthsObject[Object.keys(monthsObject)[months.value]];
        let monthsSelected = months.value;



        monthsObj.balanceFn();
        amountIn.value = "";
        submitBtn.disabled = true;
        months.disabled = false;

        alertUi("Gasto agregado correctamente", "success");
        addElements(monthsSelected, monthsObj, monthsObj.text);
    })

    //!Boton de Reset Web
    resetBtn.addEventListener("click", () => {
        document.location.reload();
    })

    //!Boton de Reset Mes
    userTextUi.addEventListener("click", (e) => {

        let monthsObj = monthsObject[Object.keys(monthsObject)[e.target.value]];

        if (e.target.value <= 12){
            monthsObj.reset();
            addElements(e.target.value, monthsObj, monthsObj.text);
        }
    })


}


function alertUi(text, type) {
    alerts.textContent = text;
    alerts.classList.add(type);


    setTimeout(() => {
        alerts.textContent = ""
        alerts.classList.remove(type);
    }, 3000);
}


function addElements(e, monthsObject, monthsTextForm) {

    let Ui = Object.values(document.querySelectorAll("div.userTextUi"))[0].children[e];
    
    Ui.innerHTML = `
        <h4>${monthsTextForm}</h4>
        <p> Total de Ingresos: $${monthsObject.amountUser} </p>
        <p> Total de Gastos: $${monthsObject.total} </p>
        <p> Disponible para ahorro: $${monthsObject.balance} </p>
        <button value=${e}> Limpiar mes </button>      
        `;
}

