var url = "https://api.bittrex.com/api/v1.1/public/getmarketsummaries";

// JSON OBJECTS
var eth = [];
var usdt = [];
var btc = [];
var prices = [];
var markets;
var response;
var coins = {};

// ÍNDICES
var eth_index;
var usdt_index;
var btc_index;

/**
 * Consume el API REST de Bittrex
 */
function request() {
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.open("GET", url, true);
    xmlhttp.onload = function () {
        if (this.readyState == 4 && this.status == 200) {
            response = JSON.parse(this.responseText).result;
            cleanData();
        }
    };
    xmlhttp.send();
}

function getCoinName(pair){
    var index = pair.indexOf("-");
    return pair.substring(index+1, pair.length);
}

function cleanData() {
    var name = "";
    var size = 0;
    var aux_coins = {};
    if (response != null || response != undefined) {
        response.forEach(element => {
            name = getCoinName(element.MarketName);
            if (coins[name] == undefined)
                coins[name] = [] 
            coins[name].push(element)
        });
        for (elem in coins){
            size = Object.keys(coins[elem]).length;
            if (size > 1){
                aux_coins[elem] = coins[elem]
            }
        }
        coins = aux_coins;
        document.getElementById("1").innerHTML = "Success! Gathered: " + Object.keys(coins).length + " cryptocurrencies en 4 different markets";        
    } else {
        console.log("Check response");
    }
}
