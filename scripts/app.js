//import { indexedDb, agregar, obtener, actualizar, eliminar, consultar} from "./indexeddb.js";

const amountIn = document.querySelector("#amount");
const alerts = document.querySelector(".alerts");
const months = document.querySelector("#months");
const amountUser = document.querySelector("#amountUser");

const resetBtn = document.querySelector("#resetBtn");
const submitBtn = document.querySelector("#submitBtn");
const amountUi = document.querySelector(".amountTotal");
const anualBalanceUi = document.querySelector("#anualBalance");
const anualAmountUi = document.querySelector("#anualAmount");
const anualTotalUi = document.querySelector("#anualTotal");

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

//! Constructor
function UserInfo() {
    this.clave,
    this.text = 0,
    this.amount = 0,
    this.amountUser = 0,
    this.balance = 0,
    this.balanceNeg = 0,
    this.total = 0,
    this.balanceFn = function () {
        this.total = this.total + this.amount,
        this.balance = this.amountUser - this.total,
        this.balanceNeg = this.amountUser-this.balance,
        this.printUi()
    },

    //*Imprimir datos en pantalla
    this.printUi = function () {

        //userInputResults
        balanceUi.textContent = `$ ${this.balance}`,
        amountUi.textContent = `$ ${this.amountUser}`,
        totalUi.textContent = `$ ${this.total}`

        //Total anual
        let anualbalance = 0;
        let anualAmount = 0;
        let anualTotal = 0;
        
        for (var i = 0; i < 12; i++) {
            anualbalance += monthsObject[Object.keys(monthsObject)[i]].balance;
            anualAmount += monthsObject[Object.keys(monthsObject)[i]].amountUser;
            anualTotal += monthsObject[Object.keys(monthsObject)[i]].total;
        }
        anualBalanceUi.textContent = `$ ${anualbalance}`
        anualAmountUi.textContent = `$ ${anualAmount}`
        anualTotalUi.textContent = `$ ${anualTotal}`
    },

    //*Reset campos Meses
    this.reset = function () {
        this.amount = 0,
        this.amountUser = 0,
        this.balance = 0,
        this.balanceNeg = 0,
        this.total = 0,
        this.printUi();
    }
};

//! Validación de formulario y Ect.
eventListener();
function eventListener() {


    submitBtn.disabled = true;
    amountUser.disabled = true;
    amountIn.disabled = true;

    //* Obtener Object de LocalStorage y reemplazar datos de meses
    monthsLS()

    //!Seleccion de Mes
    months.addEventListener("input", (g) => {

        let monthsObj = monthsObject[Object.keys(monthsObject)[months.value]]; // Mes seleccionado Object
        let monthsSelected = months.value;
        let monthsTextForm = g.target.options[monthsSelected].textContent; //Mes seleccionado String
        monthsObj.text = monthsTextForm;

        if (months.value < 12) {

            amountUser.disabled = false
            amountIn.disabled = true;


            addElements(monthsSelected, monthsObj, monthsTextForm);
            monthsObj.printUi();
            amountUser.value = monthsObj.amountUser;
            amountIn.value = "";
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

        if (amounIn === undefined || isNaN(amounIn) || amounIn > monthsObj.balance || amounIn < 1) {
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


        let monthsSelected = months.value;
        let monthsObj = monthsObject[Object.keys(monthsObject)[monthsSelected]];



        //*Realizar balance anual
        monthsObj.balanceFn();
        amountIn.value = "";
        submitBtn.disabled = true;
        months.disabled = false;

        //*Enviar datos a LocalStorage
        let mesJson = JSON.stringify(monthsObj);
        localStorage.setItem(monthsSelected, mesJson);

        /*agregar(mesNotFn) //Add Object a DB
        actualizar(mesNotFn) //Update Object a DB*/

        //*Imprimir datos en pantalla
        alertUi("Gasto agregado correctamente", "success");
        addElements(monthsSelected, monthsObj, monthsObj.text);
    })

    //!Boton de Reset Web
    resetBtn.addEventListener("click", () => {
        confirmar = confirm ("Reset all amounts?")
        if (confirmar) {
        localStorage.clear()  
        document.location.reload();
        }
    })

    //!Boton de Reset Mes
    userTextUi.addEventListener("click", (e) => {
        let monthsObj = monthsObject[Object.keys(monthsObject)[e.target.value]];
        let monthsSelected = e.target.value;
        confirmar = confirm (`Desea eliminar los montos de ${monthsObj.text}?`)

        if (confirmar) {
            monthsObj.reset();
            addElements(e.target.value, monthsObj, monthsObj.text);
            months.selectedIndex = 12;
            let mesJson = JSON.stringify(monthsObj);
            localStorage.setItem(monthsSelected, mesJson);
        }
    })
}

//! Alertas
function alertUi(text, type) {
    alerts.textContent = text;
    alerts.classList.add(type);

    setTimeout(() => {
        alerts.textContent = ""
        alerts.classList.remove(type);
    }, 3000);
}

//! Añade elementos en pantalla (userTextUi)
function addElements(e, monthsObject, monthsTextForm) {

    let Ui = Object.values(document.querySelectorAll("div.userTextUi"))[0].children[e];
    
    Ui.innerHTML = `
        <h4>${monthsTextForm}</h4>
        <p> Total de Ingresos: $${monthsObject.amountUser} </p>
        <p> Total de Gastos: $${monthsObject.total} </p>
        <p> Disponible para ahorro: $${monthsObject.balance} </p>
        <button class="resetBtn" value=${e}> Limpiar mes </button>      
        `;
}

function monthsLS(){
    for (let i = 0; i < 12; i++) {
        let getItem = localStorage.getItem(i);
        let monthsJson = JSON.parse(getItem);
        let monthsObj = monthsObject[Object.keys(monthsObject)[i]];
            
        if (getItem !== null ){
            monthsObj.text = monthsJson.text
            monthsObj.amount = monthsJson.amount
            monthsObj.amountUser = monthsJson.amountUser
            monthsObj.balance = monthsJson.balance
            monthsObj.balanceNeg = monthsJson.balanceNeg
            monthsObj.total = monthsJson.total
            monthsObj.printUi()         
            addElements(i, monthsObj, monthsObj.text);
        }
    }
}