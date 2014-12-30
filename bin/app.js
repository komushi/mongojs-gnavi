var vcap_services = JSON.parse(process.env.VCAP_SERVICES);
// var vcap_services = JSON.parse('{"mongolab":[{"name":"gnavi-json","label":"mongolab","tags":["document","mongodb","Data Store"],"plan":"sandbox","credentials":{"uri":"mongodb://CloudFoundry_ids0og1r_dnb1iag3_2snsv6co:cVBkPdnzZr9TWePtVDIy0F-cQK1dgGEx@ds043220.mongolab.com:43220/CloudFoundry_ids0og1r_dnb1iag3"}}]}');
var uri = vcap_services.mongolab[0].credentials.uri;

var collections = ["users", "gnavi"];
var mongojs = require('mongojs');
var db = mongojs(uri, collections);

var application_root = __dirname;
var express = require("express");
var request = require('request');
var path = require("path");
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
app.use(express.static(path.join(application_root, "../client")));

app.get('/callSaveGnavi', function (req, res) {
  var url = "http://api.gnavi.co.jp/ver1/RestSearchAPI/?keyid=23cf42cc2b30d584faae96e40544372e&pref=PREF13&hit_per_page=10&format=json";

  request(url, function (error, response, body) {
    if (!error && response.statusCode == 200) {
      res.set('Content-Type', 'application/json');
      res.send(body);

      var jsonbody = JSON.parse(body);

      res.send(jsonbody.rest[0]);
      for (var i in jsonbody.rest)
      {
        console.log(jsonbody.rest[i].name);  
        db.gnavi.save(jsonbody.rest[i] , function(err, saved) {
          if( err || !saved ) console.log("Rest not saved");
          else console.log(jsonbody.rest[i].name + " saved");
        });
      }
    }
    else
    {
      console.log(response.statusCode);
      console.log(error);

    }
  })
});





app.listen(process.env.PORT || 9000);

/*
var vcap_services = JSON.parse(process.env.VCAP_SERVICES);
var uri = vcap_services.mongolab[0].credentials.uri;

//var databaseUrl = "mongodb://lxu:Password123@ds043220.mongolab.com:43220/CloudFoundry_ids0og1r_dnb1iag3"; // "lxu:P@ssword123@ds043220.mongolab.com:43220/CloudFoundry_ids0og1r_dnb1iag3";

var collections = ["users", "reports"];
var mongojs = require('mongojs');
var db = mongojs(uri, collections);

db.users.save({email: "455@gmail.com", password: 'test', sex: "male"}, function(err, saved) {
  if( err || !saved ) console.log("User not saved");
  else console.log("User lxu1 saved");
});

app.get('/callSaveGnavi', function (req, res) {
  var url = "http://api.gnavi.co.jp/ver1/RestSearchAPI/?keyid=23cf42cc2b30d584faae96e40544372e&pref=PREF13&hit_per_page=10&format=json";
  request(url, function (error, response, body) {
    if (!error && response.statusCode == 200) {

      res.set('Content-Type', 'application/json');
      res.send('{"key":"value"}');

      for (var i in body.rest)
      {
        console.log(body.rest[i].name);  
      }
    }
    else
    {
      console.log(response.statusCode);
      console.log(error);

    }
  })
});
*/

/*




// app.js
var application_root = __dirname;
var express = require("express");
var request = require('request');
var path = require("path");
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
app.use(express.static(path.join(application_root, "../client")));

app.get('/api', function (req, res) {
   res.send('Ecomm API is running');
   console.log("Hello World");
});


app.get('/getGnaviPrefs', function (req, res) {
  var url = "http://api.gnavi.co.jp/ver1/PrefSearchAPI/?keyid=3752190c2d640eb83d502e192085ccf9&format=json";
  request(url, function (error, response, body) {
    if (!error && response.statusCode == 200) {

      res.set('Content-Type', 'application/json');
      res.send(body);
    }
    else
    {
      console.log(response.statusCode);
      console.log(error);

    }
  })
});

app.get('/getGnaviAreas', function (req, res) {
  var url = "http://api.gnavi.co.jp/ver1/AreaSearchAPI/?keyid=3752190c2d640eb83d502e192085ccf9&format=json";
  request(url, function (error, response, body) {
    if (!error && response.statusCode == 200) {

      res.set('Content-Type', 'application/json');
      res.send(body);
    }
    else
    {
      console.log(response.statusCode);
      console.log(error);

    }
  })
});

app.get('/getGnaviCats', function (req, res) {
  var url = "http://api.gnavi.co.jp/ver1/CategoryLargeSearchAPI/?keyid=3752190c2d640eb83d502e192085ccf9&format=json";
  request(url, function (error, response, body) {
    if (!error && response.statusCode == 200) {

      res.set('Content-Type', 'application/json');
      res.send(body);
    }
    else
    {
      console.log(response.statusCode);
      console.log(error);

    }
  })
});

app.get('/getGnaviRestByArea', function (req, res) {
  var url = "http://api.gnavi.co.jp/ver1/RestSearchAPI/?keyid=3752190c2d640eb83d502e192085ccf9&area=" + req.query.area + "&hit_per_page=1&format=json";
  request(url, function (error, response, body) {
    if (!error && response.statusCode == 200) {

      res.set('Content-Type', 'application/json');
      res.send(body);
    }
    else
    {
      console.log(response.statusCode);
      console.log(error);

    }
  })
});

app.get('/getGnaviRestByCat', function (req, res) {
  var url = "http://api.gnavi.co.jp/ver1/RestSearchAPI/?keyid=3752190c2d640eb83d502e192085ccf9&category_l=" + req.query.category_l + "&hit_per_page=1&format=json";
  request(url, function (error, response, body) {
    if (!error && response.statusCode == 200) {

      res.set('Content-Type', 'application/json');
      res.send(body);
    }
    else
    {
      console.log(response.statusCode);
      console.log(error);

    }
  })
});

app.get('/getGnaviRestByAreaCat', function (req, res) {
  var url = "http://api.gnavi.co.jp/ver1/RestSearchAPI/?keyid=3752190c2d640eb83d502e192085ccf9&category_l=" + req.query.category_l + "&area=" + req.query.area + "&hit_per_page=1&format=json";
  request(url, function (error, response, body) {
    if (!error && response.statusCode == 200) {

      res.set('Content-Type', 'application/json');
      res.send(body);
    }
    else
    {
      console.log(response.statusCode);
      console.log(error);

    }
  })
});


app.listen(process.env.PORT || 9000);

*/