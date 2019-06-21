var url = "https://api.bittrex.com/api/v1.1/public/getmarketsummaries";

// JSON OBJECTS
var markets = {};
var prices;
var balance = [9558.895, "USD"];

/**
 * Consume el API REST de Bittrex
 */
function request() {
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.open("GET", url, true);
    xmlhttp.onload = function () {
        if (this.readyState == 4 && this.status == 200) {
            cleanData(JSON.parse(this.responseText).result);
        }
    };
    xmlhttp.send();
}

function getCoinName(pair) {
    var index = pair.indexOf("-");
    return pair.substring(index + 1, pair.length);
}

function getPair(pair) {
    var index = pair.indexOf("-");
    return pair.substring(0, index);
}

function createPricesObject() {
    var usd = {
        usdt: {
            ask: markets["USDT"][0].Ask,
            bid: markets["USDT"][0].Bid
        },
        eth: {
            ask: markets["ETH"][0].Ask,
            bid: markets["ETH"][0].Bid
        },
        btc: {
            ask: markets["BTC"][0].Ask,
            bid: markets["BTC"][0].Bid
        }
    };
    var usdt = {
        eth: {
            ask: markets["ETH"][1].Ask,
            bid: markets["ETH"][0].Bid
        },
        btc: {
            ask: markets["BTC"][1].Ask,
            bid: markets["BTC"][0].Bid
        }
    };
    var btc = {
        eth: {
            ask: markets["ETH"][2].Ask,
            bid: markets["ETH"][0].Bid
        }
    };
    prices = {
        usd,
        usdt,
        btc
    };
}

function cleanData(response) {
    var name = "";
    var pair = "";
    var size = 0;
    var aux_coins = {};
    if (response != null || response != undefined) {
        // Agrupa las monedas en los diferentes mercados.
        response.forEach(element => {
            name = getCoinName(element.MarketName);
            pair = getPair(element.MarketName);
            if (markets[name] == undefined)
                markets[name] = {};
            markets[name][pair] = element;
        });
        //createPricesObject();
        // Deja sólo las monedas que tienen más de 1 mercado exepto las de interés
        var pairsOfInterest = ["BTC-ETH","USD-BTC", "USD-ETH", 
                                "USD-USDT", "USDT-BTC", "USDT-ETH"];
        for (elem in markets) {
            size = Object.keys(markets[elem]).length;
            if (size > 1 || pairsOfInterest.includes(markets[elem][Object.keys(markets[elem])[0]].MarketName)) {
                aux_coins[elem] = markets[elem];
            }
        }
        markets = aux_coins;
        console.log(markets);
        document.getElementById("info").innerHTML = "Success! Gathered: " + Object.keys(markets).length + " cryptocurrencies in 4 different markets";
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
        var fee = grossBalance * (0.0025)
        var newBalance = grossBalance-fee;
        var result = "Transaction: " + balance + " to: " + newBalance + " " + newCoin + "\n" + "Fee: " + fee + " " + newCoin;
        console.log(result);
        balance = [newBalance, newCoin];
    } else {
        console.log("Can't buy/sell " + newCoin + " , your balance it's on " + balance[1] + " and is " + balance);
    }
}

function scanMarkets() {
    var max_profit = 0;
    var mkt = "ADA";
    var base = "";
    var base2 = "";
    for (let i = 0; i < markets[mkt].length; i++) {
        base = getPair(markets[mkt][i].MarketName);
        console.log(base);
        for (let j = 0; j < markets[mkt].length; j++) {
            // Si es el mismo mkt se salta al siguiente
            base2 = getPair(markets[mkt][i].MarketName);
            if (base2 != base) {

            }

        }
    }
}