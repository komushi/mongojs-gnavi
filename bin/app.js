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
var Q = require("q");
var sleep = require("sleep");
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

var getNextOffSet = function(total_hit_count, hit_per_page, page_offset) {
  if (page_offset * hit_per_page >= total_hit_count)
  {

    return -1;
  }
  else
  {

    return page_offset + 1;
  }
};




var findURLbyCursor = function(pArea) {

  var d = Q.defer();
  var baseURL = "http://api.gnavi.co.jp/ver1/RestSearchAPI/?keyid=23cf42cc2b30d584faae96e40544372e&format=json";
  var url;

  console.log("findURLbyCursor");

  db.cursor.find({area: pArea}, function(err, cursors) {
    if(err || !cursors) 
    {
      d.reject(new Error(err));
    }
    else if (cursors.length == 0) 
    {
      console.log("no cursor");
      db.cursor.save({area: pArea, hit_per_page: 5, offset_page: 1}, function(err, saved) {
        if( err || !saved ) console.log("Cursor not saved");
        else {
          url = baseURL + "&pref=" + pArea + "&hit_per_page=5&offset_page=1";
          

          d.resolve(url);
        }
      });
    }
    else cursors.forEach( function(cursor) {

      if (cursor.offset_page == -1)
      {
        console.log("found but done");

        d.reject(new Error("Already done"));

      }
      else
      {
        console.log("found");

        var next_offset_page = Number(cursor.offset_page) + 1;
        url = baseURL + "&pref=" + cursor.area + "&hit_per_page=" + cursor.hit_per_page + "&offset_page=" + next_offset_page;

        d.resolve(url);
      }
      
    });
  });

  return d.promise;

};

var invokeGnavi = function(url) {

  var d = Q.defer();

  request(url, function (error, response, body) {
    if (!error && response.statusCode == 200) {
      // res.set('Content-Type', 'application/json');
      // res.send(body);

      var jsonbody = JSON.parse(body);

      for (var i in jsonbody.rest)
      {
        jsonbody.rest[i]["savedtime"] = new Date();
        db.gnavi.save(jsonbody.rest[i] , function(err, saved) {
          if( err || !saved ) console.log("Rest not saved");
          else ;
        });
      }


      d.resolve();
    }
    else
    {
      d.reject(new Error(error));
    }
  });

  return d.promise;

};


app.get('/api/test', function (req, res) {
  
  for (i = 0; i < 2; i++) {
    // if (i == 100) { break; }
    sleep.sleep(1);


    findURLbyCursor(req.query.area)
      .then(invokeGnavi, function (error) {
          console.log('invokeGnavi went wrong: ' + error.message);
        })
      .then(function(){db.close();console.log("Rest page saved");})
      .done();
      
      
  }

  res.send('ds');

});


app.get('/api/callSaveGnavi', function (req, res) {
  
  for (i = 0; i < 100; i++) {
    // if (i == 100) { break; }
    // sleep.sleep(1);


    findURLbyCursor(req.query.area)
      .then(invokeGnavi, function (error) {
          console.log('invokeGnavi went wrong: ' + error.message);
        })
      .then(function(){console.log("Rest page saved");})
      .done();
  
  }

  res.send('ds');

});




app.get('/api', function (req, res) {
  res.send('Our Sample API is up...');
});


app.listen(process.env.PORT || 9000);

