// var vcap_services = JSON.parse(process.env.VCAP_SERVICES);
// var vcap_services = JSON.parse('{"mongolab":[{"name":"gnavi_mongo","label":"mongolab","tags":["document","mongodb","Data Store"],"plan":"sandbox","credentials":{"uri":"mongodb://CloudFoundry_ids0og1r_hlaug1jk_m7luudm2:ZOpeI8kR-aCxW3gfnVdKKTM4FB-q1LF4@ds031601.mongolab.com:31601/CloudFoundry_ids0og1r_hlaug1jk"}}]}');
// var uri = vcap_services.mongolab[0].credentials.uri;

// var cfenv = require("cfenv");
// var appEnv = cfenv.getAppEnv();
// var services = appEnv.getServices();

// var myservice = appEnv.getService("gnavi_mongo");
// var credentials = myservice.credentials;

// var uri = credentials.uri;


var mongodbManager = require('./utils/mongodbManager');
var db;
var token = process.env["gnavi_token"];

var request = require('request');

var application_root = __dirname;
var express = require("express");
var path = require("path");
var Q = require("q");
var app = express();

var allowCrossDomain = function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');

    // intercept OPTIONS method
    if ('OPTIONS' == req.method) {
      res.send(200);
    }
    else {
      next();
    }
};

// Config
app.use(allowCrossDomain);
app.use(express.static(path.join(application_root, "public")));

var findURLbyCursor = function(pArea) {

  console.log("findURLbyCursor area:" + pArea);

  var d = Q.defer();

  var baseURL = "http://api.gnavi.co.jp/ver1/RestSearchAPI/?keyid=" + token + "&format=json";
  console.log("baseURL:" + baseURL);
  var url;
  var keyObj;

  db.cursor.find({area: pArea}, function(err, cursors) {
    if(err || !cursors) 
    {
      d.reject(new Error(err));
    }
    else if (cursors.length == 0) 
    {
      console.log("no cursor found");
      var hit_per_page = 500;

      url = baseURL + "&pref=" + pArea + "&hit_per_page=" + hit_per_page + "&offset_page=1";
      keyObj = {url: url, area: pArea, hit_per_page: hit_per_page, offset_page: 1};
      d.resolve(keyObj);

    }
    else cursors.forEach( function(cursor) {

      if (cursor.offset_page == -1)
      {
        console.log("found but done");

        d.reject(new Error("Already done"));

      }
      else
      {
        console.log("found cursor: " + cursor.offset_page);

        url = baseURL + "&pref=" + cursor.area + "&hit_per_page=" + cursor.hit_per_page + "&offset_page=" + cursor.offset_page;
        keyObj = {url: url, area: pArea, hit_per_page: cursor.hit_per_page, offset_page: cursor.offset_page};
        d.resolve(keyObj);
      }
      
    });
  });

  return d.promise;

};

var invokeGnavi = function(keyObj) {

  console.log("invokeGnavi url");

  var d = Q.defer();

  request(keyObj.url, function (error, response, body) {
    if (!error && response.statusCode == 200) {
      var jsonbody = JSON.parse(body);

      for (var i in jsonbody.rest)
      {
        jsonbody.rest[i]["savedtime"] = new Date().toISOString();
        db.gnavi.save(jsonbody.rest[i] , function(err, saved) {
          if( err || !saved ) console.log("Rest not saved: " + err);
          else ;
        });
      }

      console.log("jsonbody.total_hit_count:" + jsonbody.total_hit_count);
      keyObj["total_hit_count"] = jsonbody.total_hit_count;
      d.resolve(keyObj);
    }
    else
    {
      d.reject(new Error(error));
    }
  });

  return d.promise;

};

var updateCursor = function(keyObj) {

  var d = Q.defer();

  db.cursor.update(
    {area: keyObj.area}, 
    {$set: {area: keyObj.area,
            last_update: (new Date()).toISOString(), 
            total_hit_count: keyObj.total_hit_count,
            hit_per_page: keyObj.hit_per_page, 
            offset_page: getNextOffSet(keyObj.total_hit_count, keyObj.hit_per_page, keyObj.offset_page)}},
    {upsert: true},
    function(err, updated) {
      if( err || !updated ) {
        console.log("Not updated");
        d.reject(new Error(err));
      }
      else {
        console.log("updateCursor area:" + keyObj.area);
        d.resolve(keyObj.area);
      }
    }
  );

  return d.promise;

};

var getNextOffSet = function(total_hit_count, hit_per_page, offset_page) {

  if (offset_page * hit_per_page >= total_hit_count)
  {
    return -1;
  }
  else
  {
    return offset_page + 1;
  }
};

var startCrawling = function(pArea) {

  findURLbyCursor(pArea)
    .then(invokeGnavi)
    .then(updateCursor)
    .then(startCrawling)
    .catch(console.error)
    .done();
};

app.get('/api/crawlGnavi', function (req, res) {
  
  db = mongodbManager.getConnection(["cursor", "gnavi"]);

  startCrawling(req.query.area);

  res.send('Started crawling pref:' + req.query.area);

});


app.get('/api', function (req, res) {
  res.send('Our Sample API is up...');
});


app.listen(process.env.PORT || 9000);

