

module.exports = {

    isMasternode: function(){
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
        return "P"
    },
    getNetHashCalculation: function(calc){
        return (calc / 1000000000).toFixed(4);
    },
    masterNodeCount: function(){
        return {method: "masternode", parameters: "count"};
    },
    isValidVOUT: function(vout){
        if(vout.scriptPubKey.type != 'nonstandard' && vout.scriptPubKey.type != 'nulldata' && vout.scriptPubKey.hasOwnProperty("addresses")){
            return true;
        }else { 
            console.log('false')
            return false;
        }
    },
    name: function(){
        return "BitGreen";
    },
    genesis: {
        block: "0000025289d6b03cbda4950e825cd865185f34fbb3e098295534b63d78beba15",
        tx: "07cbcacfc822fba6bbeb05312258fa43b96a68fc310af8dfcec604591763f7cf"
    }
}