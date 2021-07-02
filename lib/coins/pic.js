

module.exports = {

    isMasternodes: function(){
        return false;
    },
    isProofOfStake: function(){
        return false;
    },
    isHeavy: function(){
        return false;
    },
    getSupply: function(){
        return "COINBASE"
    },
    getNetHash: function(){
        return "getnetworkhashps"
    },
    getNetHashUnits: function(){
        return "G"
    },
    useCustomAddresses: function(){
        return true;
    },
    customAddresses: function(address){
        return address.address;
    },
    isValidVOUT: function(vout){
        if(vout.scriptPubKey.type != 'nonstandard' && vout.scriptPubKey.type != 'nulldata' && vout.scriptPubKey.hasOwnProperty("address")){
            return true;
        }else { 
            return false;
        }
    },
    name: function(){
        return "Picacoin";
    }
}