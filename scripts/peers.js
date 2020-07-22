var mongoose = require('mongoose'),
  lib = require('../lib/explorer'),
  db = require('../lib/database'),
  settings = require('../lib/settings'),
  request = require('request'),
  cmp = require('semver-compare');

var COUNT = 5000; //number of blocks to index

function exit() {
  mongoose.disconnect();
  process.exit(0);
}

var dbString = 'mongodb://' + settings.dbsettings.user;
var mongoose = require('mongoose'),
  lib = require('../lib/explorer'),
  db = require('../lib/database'),
  settings = require('../lib/settings'),
  request = require('request'),
  cmp = require('semver-compare');

var COUNT = 5000; //number of blocks to index

function exit() {
  mongoose.disconnect();
  process.exit(0);
}

var dbString = 'mongodb://' + settings.dbsettings.user;
dbString = dbString + ':' + settings.dbsettings.password;
dbString = dbString + '@' + settings.dbsettings.address;
dbString = dbString + ':' + settings.dbsettings.port;
dbString = dbString + '/' + settings.dbsettings.database;

function create_peers(address, protocol, version) {
  if (settings.peers.use_IPStack) {
    request({
      uri: 'http://api.ipstack.com/' + address + '?access_key=' + settings.peers.apikey,
      json: true
    }, function(error, response, geo) {
      db.create_peer({
        address: address,
        protocol: protocol,
        version: version,
        //todo
        //semver: semver,
        country: geo.country_name
      }, function() {
        console.log('added %s to the peers database', address)
      });
    });
  } else {
    db.create_peer({
      address: address,
      protocol: protocol,
      version: version,
      //todo
      //semver: semver,
      country: "Unknown"
    }, function() {
      console.log('added %s to the peers database', address)
    });
  }
}

mongoose.connect(dbString, {
  useCreateIndex: true,
  useNewUrlParser: true
}, function(err) {
  if (err) {
    console.log('Unable to connect to database: %s', dbString);
    console.log('Aborting');
    exit();
  } else {
    request({
      uri: 'http://127.0.0.1:' + settings.port + '/api/getpeerinfo',
      json: true
    }, function(error, response, body) {
      lib.syncLoop(body.length, function(loop) {
        var i = loop.iteration();
        var portSplit = body[i].addr.lastIndexOf(":");
        var port = "";
        if (portSplit < 0) {
          portSplit = body[i].addr.length;
        } else {
          port = body[i].addr.substring(portSplit+1);
        }
        var address = body[i].addr.substring(0,portSplit);
        db.find_peer(address, function(peer) {
          if (peer) {
            if (isNaN(peer['port']) || peer['port'].length < 2 || peer['country'].length < 1 || peer['country_code'].length < 1) {
              db.drop_peers(function() {
                console.log('Saved peers missing ports or country, dropping peers. Re-reun this script afterwards.');
                exit();
              });
            }
            // peer already exists
            loop.next();
          } else {
            request({
              uri: 'https://freegeoip.app/json/' + address,
              json: true
            }, function(error, response, geo) {
              db.create_peer({
                address: address,
                port: port,
                protocol: body[i].version,
                version: body[i].subver.replace('/', '').replace('/', ''),
                country: geo.country_name,
                country_code: geo.country_code
              }, function(){
                loop.next();
              });
            });
          }
          //end
          var version = body[i].subver.replace('/', '').replace('/', '');
          var semver = version.split(":")[1];
          livepeers[i] = address;
          db.find_peers(address, function(peer) {
            if (peer.length) {
              for (i = 0; i < peer.length; i++) {
                // cmp(a,b)
                // result 1 = a is greater than b
                // result 0 = a is the same as b
                // result -1 = a is less than b
                if (cmp(peer[i].version.split(":")[1], semver) == -1) {
                  if (settings.peers.purge_on_run != true) {
                    db.delete_peer({
                      _id: peer[i]._id
                    });
                  }
                  create_peers(address, body[i].version, version);
                  console.log('Delete the db version:', peer[i].version.split(":")[1]); //remove
                } else if (cmp(peer[i].version.split(":")[1], semver) == 0) {
                  console.log('Do nothing, they\'re the same');
                } else {
                  //db.delete_peer({_id:peer[i]._id});
                  console.log('This should never occur, Live Version:', semver, " Is less than:", peer[i].version.split(":")[1]); //remove
                }
              }
              loop.next();
            } else {
              create_peers(address, body[i].version, version);
              loop.next();
            }
          });
        }, function() {
          db.get_peers(function(peers) {
            for (var i = 0; i < peers.length; i++) {
              if (!livepeers.includes(peers[i].address)) {
                db.delete_peer({
                  address: peers[i].address
                });
              }
            }
            exit();
          });
        });
      })
    });
  };
});
dbString = dbString + ':' + settings.dbsettings.password;
dbString = dbString + '@' + settings.dbsettings.address;
dbString = dbString + ':' + settings.dbsettings.port;
dbString = dbString + '/' + settings.dbsettings.database;

function create_peers(address, protocol, version) {
  if (settings.peers.use_IPStack) {
    request({
      uri: 'http://api.ipstack.com/' + address + '?access_key=' + settings.peers.apikey,
      json: true
    }, function(error, response, geo) {
      db.create_peer({
        address: address,
        protocol: protocol,
        version: version,
        //todo
        //semver: semver,
        country: geo.country_name
      }, function() {
        console.log('added %s to the peers database', address)
      });
    });
  } else {
    db.create_peer({
      address: address,
      protocol: protocol,
      version: version,
      //todo
      //semver: semver,
      country: "Unknown"
    }, function() {
      console.log('added %s to the peers database', address)
    });
  }
}

mongoose.connect(dbString, {
  useCreateIndex: true,
  useNewUrlParser: true
}, function(err) {
  if (err) {
    console.log('Unable to connect to database: %s', dbString);
    console.log('Aborting');
    exit();
  } else {
    var peers = Array();
    var cnt = 0;
    request({
      uri: 'http://127.0.0.1:' + settings.port + '/api/getpeerinfo',
      json: true
    }, function(error, response, body) {
      lib.syncLoop(body.length, function(loop) {
        var i = loop.iteration();
        var address = body[i].addr.split(':')[0];
        var port = body[i].addr.split(':')[1];
        request({uri: 'https://freegeoip.app/json/' + address, json: true}, function (error, response, geo) {
          if (address.startsWith('10.') || address.startsWith('192.168') || address.startsWith('172.16')) {
            geo.country_name = '[private address]';
          }
          peers[cnt++] = {
            address: address,
            port: port,
            protocol: body[i].version,
            version: body[i].subver.replace('/', '').replace('/', ''),
            country: geo.country_name
          };
          loop.next();
        });
      }, function() {
         // insert all at once after creation
         db.drop_peers(function() {
          console.log('Dropped, rebuilding...');
          lib.syncLoop(cnt, function (loop) {
            var i = loop.iteration();
            db.create_peer(peers[i], function() {
              loop.next();
            });
          }, function() {
            exit();
          });
        });
      });
    });
  };
});