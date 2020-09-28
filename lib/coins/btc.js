

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
    isValidVOUT: function(vout){
        if(scriptPubKey.type != 'nonstandard' && scriptPubKey.type != 'nulldata'){
            return true;
        }else { 
            return false;
        }
    },
    name: function(){
        return "Bitcoin";
    }
}