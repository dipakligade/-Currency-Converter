const Base_Url = "https://latest.currency-api.pages.dev/v1/currencies/";

const dropdowns = document.querySelectorAll(".dropDown select");
const btn = document.querySelector("form button");
const fromCurr = document.querySelector(".from select");
const toCurr = document.querySelector(".to select");
const msg = document.querySelector(".msg");

for (let select of dropdowns) {
    for (let currCode in countryList) {
        let newOption = document.createElement("option");
        newOption.innerText = currCode;
        newOption.value = currCode;
        if (select.name === "from" && currCode === "USD") {
            newOption.selected = "selected";
        } else if (select.name === "to" && currCode === "INR") {
            newOption.selected = "selected";
        }
        select.append(newOption);
    }
    select.addEventListener("change", (event) => {
        updateFlag(event.target);
    });
}

const updateExchangeRate = async () => {
    let amount = document.querySelector(".amount input");
    let amountValue = amount.value;
    if (amountValue === "" || amountValue < 1) {
        amountValue = 1;
        amount.value = "1";
    }

    const URL = `${Base_Url}${fromCurr.value.toLowerCase()}.json`;
    try {
        let response = await fetch(URL);
        if (!response.ok) {
            throw new Error("Failed to fetch exchange rates");
        }
        let data = await response.json();
        let rate = data[toCurr.value.toLowerCase()];


        let finalAmount = (amountValue * rate).toFixed(2);
        msg.innerText = `${amountValue} ${fromCurr.value} = ${finalAmount} ${toCurr.value}`;

    } catch (error) {
        msg.innerText = "Error fetching exchange rate!";
        console.error(error);
    }
};

const updateFlag = (element) => {
    let currCode = element.value;
    let countryCode = countryList[currCode];
    let newSrc = `https://flagsapi.com/${countryCode}/flat/64.png`;
    let img = element.parentElement.querySelector("img");

    if (img) {
        img.src = newSrc;
    }
};

btn.addEventListener("click", async (evt) => {
    evt.preventDefault();
    await updateExchangeRate();
    console.log("Exchange rate updated.");
});

window.addEventListener("load", () => {
    updateExchangeRate();
});
