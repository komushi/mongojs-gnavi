var mongojs = require('mongojs');
var uri;

var getMongoUri = function() {
  if (!uri)
  {
    var cfenv = require("cfenv");
    var appEnv = cfenv.getAppEnv();
    var services = appEnv.getServices();

    for (service in services) {
      if (services[service].tags.indexOf("mongodb") >= 0) {
        var credentials = services[service]["credentials"]
        uri = credentials.uri;

        console.log("Found ", service, " ", credentials);

        break;
      }
    }
  }

  return uri;
};

exports.getConnection = function(collections) {
  // var db = mongojs(getMongoUri(), collections);
  var db = mongojs("mongodb://CloudFoundry_1hkccbf8_ddgeunh1_53jlf853:eDw7_hXAo0dvPS5JxUpwUYZ0_Ps6I-WC@ds047752.mongolab.com:47752/CloudFoundry_1hkccbf8_ddgeunh1", collections);
  return db;

};
