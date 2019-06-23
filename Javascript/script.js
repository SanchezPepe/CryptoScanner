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
            "USD-USDT", "USDT-BTC", "USDT-ETH"];
        for (const elem in markets) {
            size = Object.keys(markets[elem]).length;
            if (size == 1 && !pairsOfInterest.includes(Object.values(markets[elem])[0].MarketName)) {
                delete markets[elem];
            }
        }
        console.log(markets);
        document.getElementById("info").innerHTML = "Success! Fetched: " + Object.keys(markets).length + " cryptocurrencies in 4 different markets";
        // Obtiene los precios del BTC, USD, ETH y USDT
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
    // BUY
    if (markets[newCoin][base] != undefined) {
        console.log("BUY");
        grossBalance = balance / markets[newCoin][base]["Ask"];
    } else {
        // SELL
        console.log("SELL");
        grossBalance = balance * markets[base][newCoin]["Bid"];
    }
    // BITREX COMMISSION 0.25%
    var fee = grossBalance * (0.0025)
    var newBalance = grossBalance - fee;
    var result = "Transaction: " + balance + " to: " + newBalance + " " + newCoin + "\n" + "Fee: " + fee + " " + newCoin;
    console.log(result);
    balance = [newBalance, newCoin];
}

function scanMarkets() {
    var max_profit = 0;
    var base = "";
    var base2 = "";
    var coinSize = Object.keys(markets[mkt]).length;
    var coins = Object.keys(markets);
    for (const c in coins) {
        coinSize = Object.keys(markets[c]).length;
        base = Object.keys(markets[c])[i];
        for (let i = 0; i < coinSize; i++) {

        }
    }
}

var markets = {}

/**
var markets = {
    "BTC": [{
            "MarketName": "USD-BTC",
            "High": 9310,
            "Low": 9046.028,
            "Volume": 472.81950411,
            "Last": 9271.732,
            "BaseVolume": 4341132.09754779,
            "TimeStamp": "2019-06-20T01:49:38.733",
            "Bid": 9260.001,
            "Ask": 9271.308,
            "OpenBuyOrders": 3697,
            "OpenSellOrders": 1160,
            "PrevDay": 9147.417,
            "Created": "2018-05-31T13:24:40.77"
        },
        {
            "MarketName": "USDT-BTC",
            "High": 9287.92674341,
            "Low": 9052.52727907,
            "Volume": 153.09997176,
            "Last": 9234.19353377,
            "BaseVolume": 1403885.5386149,
            "TimeStamp": "2019-06-20T01:49:38.733",
            "Bid": 9234.19353375,
            "Ask": 9234.19353377,
            "OpenBuyOrders": 2421,
            "OpenSellOrders": 637,
            "PrevDay": 9159.56241947,
            "Created": "2015-12-11T06:31:40.633"
        }
    ],
    "ADA": [{
            "MarketName": "USD-ADA",
            "High": 0.09167,
            "Low": 0.08797,
            "Volume": 981161.72884365,
            "Last": 0.08895,
            "BaseVolume": 87623.05274714,
            "TimeStamp": "2019-06-20T01:49:38.733",
            "Bid": 0.08831,
            "Ask": 0.08899,
            "OpenBuyOrders": 502,
            "OpenSellOrders": 579,
            "PrevDay": 0.09011,
            "Created": "2018-09-05T21:33:55.83"
        },
        {
            "MarketName": "USDT-ADA",
            "High": 0.09149999,
            "Low": 0.08760594,
            "Volume": 877602.68286985,
            "Last": 0.08850041,
            "BaseVolume": 78634.04929043,
            "TimeStamp": "2019-06-20T01:49:38.733",
            "Bid": 0.08825385,
            "Ask": 0.08858877,
            "OpenBuyOrders": 486,
            "OpenSellOrders": 680,
            "PrevDay": 0.09010877,
            "Created": "2017-12-29T19:24:39.987"
        },
        {
            "MarketName": "ETH-ADA",
            "High": 0.00034031,
            "Low": 0.00032664,
            "Volume": 937727.09609588,
            "Last": 0.00033124,
            "BaseVolume": 312.32946166,
            "TimeStamp": "2019-06-20T01:49:38.733",
            "Bid": 0.00032904,
            "Ask": 0.00033111,
            "OpenBuyOrders": 548,
            "OpenSellOrders": 1157,
            "PrevDay": 0.00033882,
            "Created": "2017-11-28T17:28:32.077"
        },
        {
            "MarketName": "BTC-ADA",
            "High": 0.00001,
            "Low": 0.00000945,
            "Volume": 18041145.68805158,
            "Last": 0.00000957,
            "BaseVolume": 176.64820782,
            "TimeStamp": "2019-06-20T01:49:38.733",
            "Bid": 0.00000956,
            "Ask": 0.00000958,
            "OpenBuyOrders": 813,
            "OpenSellOrders": 7860,
            "PrevDay": 0.0000098,
            "Created": "2017-09-29T07:01:58.873"
        }
    ],
    "SC": [{
            "MarketName": "USDT-SC",
            "High": 0.00315262,
            "Low": 0.00307451,
            "Volume": 1790362.53064015,
            "Last": 0.00313501,
            "BaseVolume": 5575.28609973,
            "TimeStamp": "2019-06-20T01:49:38.733",
            "Bid": 0.00311109,
            "Ask": 0.00314994,
            "OpenBuyOrders": 92,
            "OpenSellOrders": 266,
            "PrevDay": 0.00310201,
            "Created": "2018-04-23T20:43:33.953"
        },
        {
            "MarketName": "USD-SC",
            "High": 0.00315,
            "Low": 0.00307,
            "Volume": 935523.08223141,
            "Last": 0.00314,
            "BaseVolume": 2925.90605661,
            "TimeStamp": "2019-06-20T01:49:38.733",
            "Bid": 0.00314,
            "Ask": 0.0032,
            "OpenBuyOrders": 145,
            "OpenSellOrders": 260,
            "PrevDay": 0.00309,
            "Created": "2018-10-29T22:59:54.19"
        },
        {
            "MarketName": "ETH-SC",
            "High": 0.00001173,
            "Low": 0.00001154,
            "Volume": 2458033.28615521,
            "Last": 0.00001169,
            "BaseVolume": 28.59599867,
            "TimeStamp": "2019-06-20T01:49:38.733",
            "Bid": 0.00001166,
            "Ask": 0.00001169,
            "OpenBuyOrders": 102,
            "OpenSellOrders": 703,
            "PrevDay": 0.00001173,
            "Created": "2017-07-14T17:10:07.74"
        },
        {
            "MarketName": "BTC-SC",
            "High": 3.5e-7,
            "Low": 3.1e-7,
            "Volume": 89781245.8274658,
            "Last": 3.3e-7,
            "BaseVolume": 29.92728742,
            "TimeStamp": "2019-06-20T01:49:38.733",
            "Bid": 3.3e-7,
            "Ask": 3.4e-7,
            "OpenBuyOrders": 325,
            "OpenSellOrders": 8612,
            "PrevDay": 3.4e-7,
            "Created": "2017-05-22T21:30:29.16"
        }
    ]
};
**/
//scanMarkets();