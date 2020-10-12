const settings  = require("../lib/settings")
, fs = require('fs');
var coin;
if(fs.existsSync(__dirname + '/coins/' + settings.symbol.toLowerCase() + '.js')){
    coin = require('./coins/' + settings.symbol.toLowerCase() + '.js');
}else{
    coin = require('./coins/bitg.js'); //default
}
module.exports = coin;