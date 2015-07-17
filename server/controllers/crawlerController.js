
var mongodbManager = require('../utils/mongodbManager');
var db;
var collection;
// var token = process.env["GNAVI_ACCESSKEY"];
var token = "23cf42cc2b30d584faae96e40544372e";

var request = require('request');
var Q = require("q");
var C_HIT_PER_PAGE = 50;

exports.crawlRestaurants = function (req, res) {

  var cursor = "cursor";
  var prefecture = "" + req.query.area;
  var collectionName = req.query.collection;

  if (!collectionName) 
  {
    collectionName = prefecture;
  }

  console.log("prefecture:" + prefecture);
  console.log("collectionName:" + collectionName);

  db = mongodbManager.getConnection([cursor, collectionName]);
  collection = db.collection(collectionName);

  startCrawling(prefecture);
  res.send('Started crawling pref:' + prefecture);
};

var findURLbyCursor = function(pArea) {

  console.log("findURLbyCursor area:" + pArea);

  var d = Q.defer();

  var baseURL = "http://api.gnavi.co.jp/RestSearchAPI/20150630/?keyid=" + token + "&format=json";
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
      var hit_per_page = C_HIT_PER_PAGE;

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
  console.log(keyObj.url);
  

  var d = Q.defer();

  request(keyObj.url, function (error, response, body) {
    if (!error && response.statusCode == 200) {
      var jsonbody = JSON.parse(body);

      if (jsonbody.error)
      {
        keyObj["error"] = true;
      }
      else
      {
        for (var i in jsonbody.rest)
        {
          jsonbody.rest[i]["savedtime"] = new Date().toISOString();
          collection.save(jsonbody.rest[i] , function(err, saved) {
            if( err || !saved ) console.log("Rest not saved: " + err);
            else ;
          });
        }

        console.log("jsonbody.total_hit_count:" + jsonbody.total_hit_count);
        keyObj["total_hit_count"] = jsonbody.total_hit_count;
      }

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
            offset_page: getNextOffSet(keyObj.total_hit_count, keyObj.hit_per_page, keyObj.offset_page, keyObj.error)}},
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

var getNextOffSet = function(total_hit_count, hit_per_page, offset_page, error) {

  if (error)
  {
    return -1;
  }

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





