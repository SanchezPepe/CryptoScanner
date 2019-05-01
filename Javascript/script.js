// https://api.bittrex.com/api/v1.1/public/getticker?market=BTC-LTC

var url = "https://api.bittrex.com/api/v1.1/public/getmarketsummaries";

// JSON OBJECTS
var eth = [];
var usdt = [];
var btc_eth = [];
var btc_usdt = [];

// ÍNDICES
var eth_index;
var usdt_index;
var btc_eth_index;
var btc_usdt_index;

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
        var pair = "";
        if (name.includes("ETH")) {
            eth.push(e);
            pair = name.replace("ETH", "BTC");
            btc_eth.push(pair);
        } else if (name.includes("USDT")) {
            usdt.push(e);
            pair = name.replace("USDT", "BTC");
            btc_usdt.push(pair);
        }
    });
    var aux_eth = [];
    var aux_usdt = [];
    array.forEach(element => {
        var name = element.MarketName;
        if (name.includes("BTC")) {
            if (btc_eth.includes(name)) {
                aux_eth.push(element);
            }
            if (btc_usdt.includes(name)) {
                aux_usdt.push(element);
            }
        }
    });
    btc_eth = aux_eth;
    btc_usdt = aux_usdt;

    eth_index = createIndex(eth, "ETH");
    usdt_index = createIndex(usdt, "USDT");
    btc_eth_index = createIndex(btc_eth, "BTC");
    btc_usdt_index = createIndex(btc_usdt, "BTC");

    checkMarkets("SC");
}

function createIndex(array, coin){
    var res = [];
    array.forEach(elem => {
        var name = elem.MarketName.replace(coin + '-', "");
        res.push(name);
    });
    return res;
}

function checkMarkets(mkt){
    // Para c/u se busca en el índice y se accede al elemento           
    var index = usdt_index.indexOf(mkt);
    var usdt_obj = usdt[index];

    index = btc_usdt_index.indexOf(mkt);
    var btc_usdt_obj = btc_usdt[index];

    index = eth_index.indexOf(mkt);
    var eth_obj = eth[index];

    index = btc_eth_index.indexOf(mkt);
    var btc_eth_obj = btc_eth[index];

    document.getElementById("a1").innerHTML = JSON.stringify(usdt_obj);  
    document.getElementById("a2").innerHTML = JSON.stringify(btc_usdt_obj);
    document.getElementById("a3").innerHTML = JSON.stringify(eth_obj);  
    document.getElementById("a4").innerHTML = JSON.stringify(btc_eth_obj);  

}