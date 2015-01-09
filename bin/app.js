// var vcap_services = JSON.parse(process.env.VCAP_SERVICES);
var vcap_services = JSON.parse('{"mongolab":[{"name":"gnavi-json","label":"mongolab","tags":["document","mongodb","Data Store"],"plan":"sandbox","credentials":{"uri":"mongodb://CloudFoundry_ids0og1r_raeg4u11_3t4su8ja:jIihP2DJBQ0hOQDFMpruYwk0EpuKBCmk@ds031691.mongolab.com:31691/CloudFoundry_ids0og1r_raeg4u11"}}]}');
var uri = vcap_services.mongolab[0].credentials.uri;

var collections = ["cursor", "gnavi"];
var mongojs = require('mongojs');
var db = mongojs(uri, collections);

var request = require('request');

var application_root = __dirname;
var express = require("express");
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
app.use(express.static(path.join(application_root, "public")));

function getNextStart(total_hit_count, hit_per_page, page_offset) {
  if (page_offset * hit_per_page >= total_hit_count)
  {

    return -1;
  }
  else
  {

    return page_offset + 1;
  }
};


function saveCursor(next_start) {

  db.cursor.find({keyid: "cursor"}, function(err, cursors) {
    if( err || !cursors) 
    {
      db.cursor.save({keyid: "cursor", position: next_start}, function(err, saved) {
        if( err || !saved ) console.log("Cursor not saved");
        else console.log("Cursor saved");
      });

    }
    else cursors.forEach( function(cursor) {
      db.cursor.update({keyid: "cursor"}, {$set: {position: next_start}}, function(err, updated) {
        if( err || !updated ) console.log("Cursor not updated");
        else console.log("Cursor updated");
      });


    } );
  });


};

var baseURL = "http://api.gnavi.co.jp/ver1/RestSearchAPI/?keyid=23cf42cc2b30d584faae96e40544372e&format=json";

function findURLbyCursor(pArea) {

  var url;

  console.log("findURLbyCursorx");

      // db.cursor.save({keyid: "cursor", position: 1}, function(err, saved) {
      //   if( err || !saved ) console.log("Cursor not saved");
      //   else console.log("Cursor saved");
      // });

  db.cursor.find({area: pArea}, function(err, cursors) {
    console.log(err);
    console.log(cursors);
    console.log(cursors.length);
    if(err || !cursors) 
    {
      console.log("error");
    }
    else if (cursors.length == 0) 
    {
      console.log("no cursor");
      db.cursor.save({area: pArea, hit_per_page: 10, offset_page: 1}, function(err, saved) {
        if( err || !saved ) console.log("Cursor not saved");
        else {
          url = baseURL + "&pref=" + pArea + "&hit_per_page=10&offset_page=1";
          console.log("url:" + url);
        }
      });
    }
    else cursors.forEach( function(cursor) {
      
      console.log("found");
      var next_offset_page = Number(cursor.offset_page) + 1;
      url = baseURL + "&pref=" + cursor.area + "&hit_per_page=10" + "&offset_page=" + next_offset_page;
      console.log("url:" + url);
    });


  });

  return url;
};

app.get('/api/test', function (req, res) {
  // var area = req.query.area;
  console.log(req.query.area);
  // res.send('found something?');
  res.send(findURLbyCursor(req.query.area));
});

app.get('/api/callSaveGnavi', function (req, res) {

  // var url = "http://api.gnavi.co.jp/ver1/RestSearchAPI/?keyid=23cf42cc2b30d584faae96e40544372e&pref=PREF11&hit_per_page=10&format=json";
  var url = findURLbyCursor(req.query.area);
  res.set('Content-Type', 'application/json');

  request(url, function (error, response, body) {
    if (!error && response.statusCode == 200) {
      // res.set('Content-Type', 'application/json');
      res.send(body);

      var jsonbody = JSON.parse(body);

      for (var i in jsonbody.rest)
      {
        console.log(jsonbody.rest[i].name);  
        db.gnavi.save(jsonbody.rest[i] , function(err, saved) {
          if( err || !saved ) console.log("Rest not saved");
          else console.log(jsonbody.rest[i].name_kana + " saved");
        });
      }
    }
    else
    {
      console.log(response.statusCode);
      console.log(error);

    }
  });
});


app.get('/api', function (req, res) {
  res.send('Our Sample API is up...');
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