const amount = document.querySelector("#amount");
const error = document.querySelector(".error");
const userText = document.querySelector("#userText");

const resetBtn = document.querySelector("#resetBtn");
const submitBtn = document.querySelector("#submitBtn");


const amountUi = document.querySelector(".amountTotal");
const balanceUi = document.querySelector(".balance");
const totalUi = document.querySelector(".totalIn");
const userTextUi = document.querySelector(".userTextUi");

const forms = document.querySelector(".forms");
const userInfo = {
    text: "",
    amount: 0,
    amountUser: parseInt(prompt("Ingrese su Presupuesto...")),
    balance: 0,
    total: 0,
    balanceFn() {
        this.balance = this.amountUser - this.amount;
        this.amountUser = this.amountUser - this.amount;
        this.total = this.total + this.amount;
        balanceUi.textContent = this.balance;
        amountUi.textContent = this.total;
    },
}


console.log(error.textContent);

console.log(userInfo);

eventListener();
function eventListener() {

    forms.reset()
    userInfo.balance = userInfo.amountUser;
    totalUi.textContent = userInfo.amountUser;


    userText.addEventListener("input", () => {
        let userTextIn = userText.value;
        if (userTextIn.length == 0) {
            alertUi("Ingrese una descripción... o no");
        }else{
            userInfo.text = userTextIn;
            console.log(userInfo);

        }
    })

    amount.addEventListener("input", () => {
        let amounIn = amount.value;
        if (amounIn === undefined || amounIn <= 0 || isNaN(amounIn) ) {
            alertUi("Ingrese un Monto valido");
        }else {
            userInfo.amount = parseInt(amounIn);
        };

    })

    submitBtn.addEventListener("click", (e) =>	{
        e.preventDefault();

        if(userInfo.balance < userInfo.amount){
            alertUi("Su saldo es muy bajo");
        }else {
            userInfo.balanceFn();
            forms.reset();
        }
    })

    resetBtn.addEventListener("click", () =>{
        document.location.reload();
    })
}


function alertUi (f) {
    error.textContent = f;

    setTimeout(()=>{
        error.textContent = ""
    }, 3000);
}


