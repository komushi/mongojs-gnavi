var mongojs = require('mongojs');
var uri;

var getMongoUri = function() {
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
