var mongojs = require('mongojs');
var uri;

var getMongoUri = function() {

  // return "mongodb://CloudFoundry_1hkccbf8_on37bn9p_qo6pmlvs:AZ45Jm6MM0CPZvfO-68nI3EhPvf4Vbm0@ds053818.mongolab.com:53818/CloudFoundry_1hkccbf8_on37bn9p";

  if (!uri)
  {
    var cfenv = require("cfenv");
    var appEnv = cfenv.getAppEnv();
    var services = appEnv.getServices();
    
    var myservice = appEnv.getService("gnavi_mongo");
    var credentials = myservice.credentials;
    
    uri = credentials.uri;
  }
  
  return uri;
};


exports.getConnection = function(collections) {
  var db = mongojs(getMongoUri(), collections);
  return db;

};
