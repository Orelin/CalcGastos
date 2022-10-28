const userText = document.querySelector("#userText");
const amount = document.querySelector("#amount");
const btn = document.querySelector("button");
const userInfo = {
    text: userText.value,
    amount: amount.value,
    //!Add userMoney


}

console.log(userInfo);

eventListener();
function eventListener() {

    //!Add verification
    userText.addEventListener("blur", () => {
        let userTextIn = userText.value;
        console.log(userTextIn);



    })

    amount.addEventListener("blur", () => {
        let amounIn = amount.value;
        console.log(amounIn);


    })

    btn.addEventListener("click", (e) =>	{
        e.preventDefault();

        console.log("Que tocas!")
    })
}





