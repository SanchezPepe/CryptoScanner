// https://api.bittrex.com/api/v1.1/public/getticker?market=BTC-LTC
var url = "https://api.bittrex.com/api/v1.1/public/getmarketsummaries";

// JSON OBJECTS
var eth = [];
var usdt = [];
var btc = [];
var prices = [];
var markets;

// ÍNDICES
var eth_index;
var usdt_index;
var btc_index;

request();

function request() {
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            arr = JSON.parse(this.responseText).result;
            getPairsBothMarkets(arr);
        }
    };
    xmlhttp.open("GET", url, true);
    xmlhttp.send();
}

function getPairsBothMarkets(array) {
    array.forEach(e => {
        var name = e.MarketName;
        var pair;
        if (name.includes("BTC-ETH") || name.includes("USDT-BTC") || name.includes("USDT-ETH")) {
            prices.push(e);
        }
        if (name.includes("ETH")) {
            eth.push(e);
            pair = name.replace("ETH", "BTC");
            btc.push(pair);
        } else if (name.includes("USDT")) {
            usdt.push(e);
            pair = name.replace("USDT", "BTC");
            btc.push(pair);
        }
    });
    var aux = [];
    array.forEach(element => {
        var name = element.MarketName;
        if (name.includes("BTC")) {
            if (btc.includes(name))
                aux.push(element);
        }
    });
    btc = aux;
    markets = [btc, eth, usdt];
    eth_index = createIndex(eth, "ETH");
    usdt_index = createIndex(usdt, "USDT");
    btc_index = createIndex(btc, "BTC");

    checkCoinThroughMarkets("SC");
    checkDifference("SC");
}

function createIndex(array, coin) {
    var res = [];
    array.forEach(elem => {
        var name = elem.MarketName.replace(coin + '-', "");
        res.push(name);
    });
    return res;
}

function checkCoinThroughMarkets(coin) {
    var indexes = [btc_index, eth_index, usdt_index];
    var objects = [null, null, null];
    var index = 0;

    // Para cada uno de los mercados se busca el índice y se guarda el obj
    for (i = 0; i < markets.length; i++) {
        index = indexes[i].indexOf(coin);
        if (index != -1) {
            objects[i] = markets[i][index];
            document.getElementById("" + i).innerHTML = JSON.stringify(objects[i]);
        }
    }
    return objects;
}

function checkDifference(coin) {
    var objects = checkCoinThroughMarkets(coin);
    var USDT_ETH = prices[0].Ask;
    var BTC_ETH = prices[1].Ask;
    var USDT_BTC = prices[2].Ask;
    var BTC_coin = objects[0].Ask;
    var ETH_coin = objects[1].Ask;
    var USDT_coin = objects[2].Ask;

    var res = 1;
 
    // Empieza en BTC
    res = 1 / BTC_coin;
    // Res en coin y se pasa a ETH
    res = res * ETH_coin;
    // Res en ETH y se regresa a Bitcoin
    res = res * BTC_ETH;

    console.log(res);
    document.getElementById("3").innerHTML = ("" + res);
    return res;
}