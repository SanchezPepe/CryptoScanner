var url = "https://api.bittrex.com/api/v1.1/public/getmarketsummaries";

// JSON OBJECTS
var prices;
var balance = [1, "BTC"];

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
        // Deja sólo las monedas que tienen más de 1 mercado exepto las de interés
        var pairsOfInterest = ["BTC-ETH", "USD-BTC", "USD-ETH",
            "USD-USDT", "USDT-BTC", "USDT-ETH"
        ];
        for (const elem in markets) {
            size = Object.keys(markets[elem]).length;
            if (size == 1 && !pairsOfInterest.includes(Object.values(markets[elem])[0].MarketName)) {
                delete markets[elem];
            }
        }
        console.log(markets);
        document.getElementById("info").innerHTML = "Success! Fetched: " + Object.keys(markets).length + " cryptocurrencies in 4 different markets";
        // Obtiene los precios del BTC, USD, ETH y USDT
        //scanMarkets();
    } else {
        console.log("Check response");
    }
}

function transaction(base, newCoin) {
    request();
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

function convert(base, newCoin, balance) {
    //request();
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
    var fee = grossBalance * (0.0025)
    var newBalance = grossBalance - fee;
    var result = transaction + " " + balance + " " + base + " to: " + newBalance + " " + newCoin + ". Fee: " + fee + " " + newCoin;
    console.log(result);
    return newBalance;
}

function scanMarkets() {
    var max_profit = 0;
    var coinKeys;
    var coins = Object.keys(markets);
    var originalBalance = 1;
    var balance, newBalance;
    coins.forEach(coin => {
        console.log("=======================================");
        coinKeys = Object.keys(markets[coin]);
        coinKeys.forEach(pair => {
            sellMarkets = coinKeys.filter(c => c != pair);
            sellMarkets.forEach(sellCoin => {
                console.log("EVALUATING", pair, coin);
                balance = convert(pair, coin, originalBalance); // 1 PAIR COIN
                console.log("EVALUATING", coin, sellCoin);
                newBalance = convert(coin, sellCoin, balance);
                console.log("EVALUATING", sellCoin, pair);
                newBalance = convert(sellCoin, pair, newBalance);
                console.log("PERCENT CHANGE: ", Math.round((((newBalance/originalBalance)-1)*100) * 10000) / 10000 + "%");
            });
        });
    });
}

var markets = {
    "NPXS": {
        "BTC": {
            "MarketName": "BTC-NPXS",
            "High": 9e-8,
            "Low": 7e-8,
            "Volume": 521635932.2047428,
            "Last": 9e-8,
            "BaseVolume": 41.88774505,
            "TimeStamp": "2019-06-23T02:28:26.037",
            "Bid": 8e-8,
            "Ask": 9e-8,
            "OpenBuyOrders": 325,
            "OpenSellOrders": 3420,
            "PrevDay": 8e-8,
            "Created": "2018-10-22T00:47:15.047"
        },
        "USDT": {
            "MarketName": "USDT-NPXS",
            "High": 0.00098,
            "Low": 0.00082534,
            "Volume": 6420727.24711742,
            "Last": 0.00085002,
            "BaseVolume": 5864.69254432,
            "TimeStamp": "2019-06-23T02:28:26.037",
            "Bid": 0.00088327,
            "Ask": 0.00090274,
            "OpenBuyOrders": 66,
            "OpenSellOrders": 87,
            "PrevDay": 0.00082609,
            "Created": "2018-12-11T17:05:36.773"
        },
        "ETH": {
            "MarketName": "ETH-NPXS",
            "High": 0.00000297,
            "Low": 0.0000028,
            "Volume": 14135889.1270175,
            "Last": 0.0000029,
            "BaseVolume": 40.59138388,
            "TimeStamp": "2019-06-23T02:28:26.037",
            "Bid": 0.00000286,
            "Ask": 0.0000029,
            "OpenBuyOrders": 28,
            "OpenSellOrders": 165,
            "PrevDay": 0.0000028,
            "Created": "2018-12-06T17:40:19.817"
        }
    },
    "ETH": {
        "USD": {
            "MarketName": "USD-ETH",
            "High": 315,
            "Low": 300.043,
            "Volume": 7162.36231964,
            "Last": 311.047,
            "BaseVolume": 2203587.62949367,
            "TimeStamp": "2019-06-23T03:28:22.247",
            "Bid": 311.063,
            "Ask": 311.572,
            "OpenBuyOrders": 1372,
            "OpenSellOrders": 458,
            "PrevDay": 307.662,
            "Created": "2018-06-20T18:16:05.573"
        },
        "USDT": {
            "MarketName": "USDT-ETH",
            "High": 318.15587667,
            "Low": 300.50844762,
            "Volume": 6036.6846848,
            "Last": 313.18503803,
            "BaseVolume": 1860797.47437501,
            "TimeStamp": "2019-06-23T03:28:22.247",
            "Bid": 313.06822951,
            "Ask": 313.18813448,
            "OpenBuyOrders": 901,
            "OpenSellOrders": 453,
            "PrevDay": 306.99999999,
            "Created": "2017-04-20T17:26:37.647"
        },
        "BTC": {
            "MarketName": "BTC-ETH",
            "High": 0.02934351,
            "Low": 0.02784999,
            "Volume": 12002.65296925,
            "Last": 0.02926598,
            "BaseVolume": 343.5947418,
            "TimeStamp": "2019-06-23T03:28:22.247",
            "Bid": 0.02922909,
            "Ask": 0.02926599,
            "OpenBuyOrders": 1796,
            "OpenSellOrders": 5499,
            "PrevDay": 0.02840354,
            "Created": "2015-08-14T09:02:24.817"
        }
    },
    "BTC": {
        "USD": {
            "MarketName": "USD-BTC",
            "High": 11190,
            "Low": 10280,
            "Volume": 1557.99787183,
            "Last": 10650,
            "BaseVolume": 16742601.22471711,
            "TimeStamp": "2019-06-23T03:28:22.247",
            "Bid": 10639.715,
            "Ask": 10639.716,
            "OpenBuyOrders": 3780,
            "OpenSellOrders": 841,
            "PrevDay": 10790.882,
            "Created": "2018-05-31T13:24:40.77"
        },
        "USDT": {
            "MarketName": "USDT-BTC",
            "High": 11171.35076857,
            "Low": 10350,
            "Volume": 727.17969393,
            "Last": 10701.4,
            "BaseVolume": 7817032.29075771,
            "TimeStamp": "2019-06-23T03:28:22.247",
            "Bid": 10706.79627239,
            "Ask": 10716.02422329,
            "OpenBuyOrders": 2443,
            "OpenSellOrders": 521,
            "PrevDay": 10800,
            "Created": "2015-12-11T06:31:40.633"
        }
    },
    "USDT": {
        "USD": {
          "MarketName": "USD-USDT",
          "High": 1.00444,
          "Low": 0.99,
          "Volume": 569901.03753068,
          "Last": 0.995,
          "BaseVolume": 569116.182571,
          "TimeStamp": "2019-06-23T03:28:22.247",
          "Bid": 0.99462,
          "Ask": 0.995,
          "OpenBuyOrders": 204,
          "OpenSellOrders": 210,
          "PrevDay": 1.00098,
          "Created": "2018-05-31T13:27:08.477"
        }
    }
};