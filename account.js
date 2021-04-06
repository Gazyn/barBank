if (localStorage.hasOwnProperty("loginData")) {
    const gotten = localStorage.getItem("loginData");
    loginData = JSON.parse(gotten);
} else {
    document.innerHTML = "wtf cringe u aint logged in";
}

function addToTable(status, name, date, sum) { //Will be used to automatically populate table once data creation is implemented
    let row = document.createElement("tr");
    let data1 = document.createElement("td");
    let data2 = document.createElement("td");
    let data3 = document.createElement("td");
    let data4 = document.createElement("td");
    data1.textContent = status;
    data2.textContent = name;
    data3.textContent = date;
    data4.textContent = sum;
    sum < 0 ? data4.style.color = "red" : data4.style.color = "green";
    row.appendChild(data1);
    row.appendChild(data2);
    row.appendChild(data3);
    row.appendChild(data4);
    operations.appendChild(row);
}

function populateTable(){
    Array.from(document.querySelectorAll("tr")).slice(1).forEach(function(e){operations.removeChild(e)})
    for(let i in loginData.transactions) {
        let data = loginData.transactions[i];
        addToTable(data.status, data.accountTo, new Date(data.createdAt).toLocaleDateString(), data.amount+" "+data.currency);
    }
}

window.addEventListener('DOMContentLoaded', (event) => {
    accName.textContent = loginData.accounts['0'].name;
    accBalanceNumber.textContent = loginData.accounts['0'].balance+" "+loginData.accounts['0'].currency;
    accNumber.textContent = "Account number: "+loginData.accounts['0'].number;
    populateTable()
});