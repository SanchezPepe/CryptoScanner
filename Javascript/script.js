var url = "https://api.bittrex.coms/api/v1.1/public/getmarketsummaries";

// JSON OBJECTS
var prices;
var balance = [1, "BTC"];
var markets = {};
/**
 * Consume el API REST de Bittrex
 */
function request() {
    try {
        document.getElementById("info").innerHTML = "Success! Fetched: " + Object.keys(markets).length + " cryptocurrencies in 4 different markets";
        var xmlhttp = new XMLHttpRequest();
        xmlhttp.open("GET", url, true);
        xmlhttp.onload = function () {
            if (this.readyState == 4 && this.status == 200) {
                cleanData(JSON.parse(this.responseText).result);
            }
        };
        xmlhttp.send();
    } catch (error) {
        document.getElementById("info").innerHTML = "Error - API REQUEST: " + error.toString();
    }
}

function cleanData(response) {
    var name = "";
    var pair = "";
    var size = 0;
    if (response != null || response != undefined) {
        // Agrupa las monedas en los diferentes mercados.
        response.forEach(element => {
            name = getCoinName(element.MarketName);
            pair = getPair(element.MarketName);
            if (markets[name] == undefined)
                markets[name] = {};
            markets[name][pair] = element;
        });
        // Deja sólo los pares de monedas que tienen más de 1 mercado excepto las de interés
        var pairsOfInterest = ["BTC-ETH", "USD-BTC", "USD-ETH",
            "USD-USDT", "USDT-BTC", "USDT-ETH"
        ];
        for (const elem in markets) {
            size = Object.keys(markets[elem]).length;
            if (size == 1 && !pairsOfInterest.includes(Object.values(markets[elem])[0].MarketName)) {
                delete markets[elem];
            }
        }
        document.getElementById("info").innerHTML = "Success! Fetched: " + Object.keys(markets).length + " cryptocurrencies in 4 different markets";
        scanMarkets();
        // Obtiene los precios del BTC, USD, ETH y USDT
    } else {
        console.log("Check response");
    }
}

function transaction(base, newCoin) {
    var grossBalance;
    if (base == balance[1]) {
        // BUY
        if (markets[newCoin] != undefined) {
            grossBalance = balance[0] / markets[newCoin][base]["Ask"];
        } else {
            // SELL
            console.log(newCoin, base);
            grossBalance = balance[0] * markets[base][newCoin]["Bid"];
        }
        // BITREX COMMISSION 0.25%
        var fee = grossBalance * (0.0025)
        var newBalance = grossBalance - fee;
        var result = "Transaction: " + balance + " to: " + newBalance + " " + newCoin + "\n" + "Fee: " + fee + " " + newCoin;
        console.log(result);
        balance = [newBalance, newCoin];
    } else {
        console.log("Can't buy/sell " + newCoin + " , your balance it's on " + balance[1] + " and is " + balance);
    }
}

function transaction(base, newCoin, balance) {
    var grossBalance;
    var transaction;
    // BUY
    if (markets[newCoin] != undefined && markets[newCoin][base] != undefined) {
        transaction = "BUY";
        grossBalance = balance / markets[newCoin][base]["Ask"];
    } else {
        // SELL
        transaction = "SELL";
        grossBalance = balance * markets[base][newCoin]["Bid"];
    }
    // BITREX COMMISSION 0.25%
    var fee = grossBalance * (0.0025);
    var newBalance = grossBalance - fee;
    var result = transaction + " " + balance + " " + base + " to: " + newBalance + " " + newCoin + ". Fee: " + fee + " " + newCoin;
    console.log(result);
    return newBalance;
}

function scanMarkets() {
    fitMarketsContainer();
    var change;
    var coinKeys;
    var coins = Object.keys(markets);
    var originalBalance = 1;
    var balance, newBalance;
    coins.forEach(coin => {
        coinKeys = Object.keys(markets[coin]);
        coinKeys.forEach(pair => {
            sellMarkets = coinKeys.filter(c => c != pair);
            sellMarkets.forEach(sellCoin => {
                balance = transaction(pair, coin, originalBalance); // 1 PAIR COIN
                newBalance = transaction(coin, sellCoin, balance);
                newBalance = transaction(sellCoin, pair, newBalance);
                change = Math.round((((newBalance / originalBalance) - 1) * 100) * 10000) / 10000;
                console.log("PERCENTAGE CHANGE: ", change + "%");
                console.log("=======================================");
                //if (Math.abs(change) <= 100 || change > 0) {
                addRow(pair, coin, sellCoin, round7Digits(newBalance) + " " + pair, round3Digits(change));
                //}
            });
        });
    });
}

function addRow(base, bridge, sell, final, change) {
    var table = document.getElementById("table-body");
    var row = document.createElement("tr");
    var content =
        "<td>" + base + "</td>" +
        "<td>" + bridge + "</td>" +
        "<td>" + sell + "</td>" +
        "<td>" + final + "</td>";
    if (change > 0) {
        content += "<td class='is-success'>" + change + "% </td>";
        row.innerHTML = content;
        table.insertBefore(row, table.firstElementChild);
    } else {
        content += "<td class='is-danger'>" + change + "% </td>";
        row.innerHTML = content;
        table.appendChild(row);
    }
}

function refreshData() {
    var myNode = document.getElementById("table-body");
    setTimeout(function () {
        while (myNode.firstChild) {
            myNode.removeChild(myNode.firstChild);
        }
    }, 100);
    setTimeout(function () {
        request();
    }, 150);

}

function round7Digits(num) {
    return Math.round((num) * 10000000) / 10000000;
}

function round3Digits(num) {
    return Math.round((num) * 1000) / 1000;
}

function getCoinName(pair) {
    var index = pair.indexOf("-");
    return pair.substring(index + 1, pair.length);
}

function getPair(pair) {
    var index = pair.indexOf("-");
    return pair.substring(0, index);
}

function fitMarketsContainer() {
    var h = window.innerHeight;
    document.getElementById("mkts-container").style.height = (h * 0.50) + "px";
}