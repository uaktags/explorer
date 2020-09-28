const { settings } = require("../app")
, fs = require('fs');
var coin;
if(fs.existsSync('./coins/' + settings.coin + '.js')){
    coin = require('./coins/' + settings.coin);
}else{
    coin = require('./coins/btc.js'); //default
}

module.exports = coin;