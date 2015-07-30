
var mongodbManager = require('../utils/mongodbManager');
var db;
var collection;
var token = process.env["GNAVI_ACCESSKEY"];

var request = require('request');
var Q = require("q");
var C_HIT_PER_PAGE = 50;
var prefectures;

exports.crawlRestaurants = function (req, res) {

  prefectures = req.body.pref;
  var collectionName = req.body.collection;

  console.log("prefecture:" + JSON.stringify(prefectures));
  console.log("collectionName:" + collectionName);

  if (!collectionName) 
  {
    collectionName = "gnavi";
  }

  db = mongodbManager.getConnection(["cursor", collectionName, "area", "prefecture", "category"]);
  collection = db.collection(collectionName);
  
  crawlArea()
    .then(crawlCategory)
    .then(crawlPrefecture)
    .then(startCrawling)
    .catch(function (error) {
      // Handle any error from all above steps
      console.error('You had an error: ', error.stack);
    })
    .done(function() {
      console.log('Finished!');
    });
  res.send('Started crawling!');
  
  // startCrawling(prefectures[0].pref_code);
  // res.send('Started crawling pref:' + JSON.stringify(prefectures));
};

var crawlArea = function() {
  var d = Q.defer();

  var areaURL = "http://api.gnavi.co.jp/master/AreaSearchAPI/20150630/?keyid=" + token + "&format=json";

  request(areaURL, function (error, response, body) {
    if (!error && response.statusCode == 200) {
      var jsonbody = JSON.parse(body);
      console.log(JSON.stringify(jsonbody));
      db.area.save(jsonbody , function(err, saved) {
        if( err || !saved ) console.log("Areas not saved: " + err);
        else console.log("Areas saved!");
      });
      d.resolve();
    }
    else
    {
      d.reject(new Error(error));
    }
  });

  return d.promise;
};

var crawlCategory = function() {
  var d = Q.defer();

  var categoryURL = "http://api.gnavi.co.jp/master/CategoryLargeSearchAPI/20150630/?keyid=" + token + "&format=json";

  request(categoryURL, function (error, response, body) {
    if (!error && response.statusCode == 200) {
      var jsonbody = JSON.parse(body);
      console.log(JSON.stringify(jsonbody));
      db.category.save(jsonbody , function(err, saved) {
        if( err || !saved ) console.log("Categories not saved: " + err);
        else console.log("Categories saved!");
      });
      d.resolve();
    }
    else
    {
      d.reject(new Error(error));
    }
  });

  return d.promise;
};

var crawlPrefecture = function() {
  var d = Q.defer();

  var prefURL = "http://api.gnavi.co.jp/master/PrefSearchAPI/20150630/?keyid=" + token + "&format=json";

  request(prefURL, function (error, response, body) {
    if (!error && response.statusCode == 200) {
      var jsonbody = JSON.parse(body);
      console.log(JSON.stringify(jsonbody));

      db.prefecture.save(jsonbody , function(err, saved) {
        if( err || !saved ) console.log("Prefectures not saved: " + err);
        else console.log("Prefectures saved!");
      });

      if (!prefectures)
      {
        prefectures = jsonbody.pref;
      }

      console.log('Started crawling pref:' + JSON.stringify(prefectures));

      d.resolve(prefectures[0].pref_code);

    }
    else
    {
      d.reject(new Error(error));
    }
  });

  return d.promise;
};

var startCrawling = function(prefecture) {
  
    findURLbyCursor(prefecture)
      .then(invokeGnavi)
      .then(updateCursor)
      .then(startCrawling)
      .catch(function (error) {
        // Handle any error from all above steps
        console.error('You had an error: ', error.stack);

        var nextIndex = getPrefectureIndex(prefecture) + 1;
        if (prefectures.length > nextIndex)
        {
          var nextPrefecture = prefectures[nextIndex];
          console.log("next prefecture:" + nextPrefecture.pref_code);
          startCrawling(nextPrefecture.pref_code);
        }
        console.log("last prefecture:" + prefecture);
      })
      .done(function() {
      });

};

var getPrefectureIndex = function(prefecture) 
{
  var index = prefectures.map(function(el) {
    return el.pref_code;
  }).indexOf(prefecture);

  return index;
};

var findURLbyCursor = function(prefecture) {

  // console.log("findURLbyCursor prefecture:" + prefecture);

  var d = Q.defer();

  var baseURL = "http://api.gnavi.co.jp/RestSearchAPI/20150630/?keyid=" + token + "&format=json";

  var url;
  var keyObj;

  db.cursor.find({prefecture: prefecture}, function(err, cursors) {
    if(err || !cursors)
    {
      d.reject(new Error(err));
    }
    else if (cursors.length == 0)
    {
      console.log("no cursor found");
      var hit_per_page = C_HIT_PER_PAGE;

      url = baseURL + "&pref=" + prefecture + "&hit_per_page=" + hit_per_page + "&offset_page=1";
      keyObj = {url: url, prefecture: prefecture, hit_per_page: hit_per_page, offset_page: 1};
      console.log("keyObj:" + JSON.stringify(keyObj));
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
        // console.log("found cursor: " + cursor.offset_page);

        url = baseURL + "&pref=" + cursor.prefecture + "&hit_per_page=" + cursor.hit_per_page + "&offset_page=" + cursor.offset_page;
        keyObj = {url: url, prefecture: prefecture, hit_per_page: cursor.hit_per_page, offset_page: cursor.offset_page};
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

        // console.log("jsonbody.total_hit_count:" + jsonbody.total_hit_count);
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
    {prefecture: keyObj.prefecture},
    {$set: {prefecture: keyObj.prefecture,
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
        // console.log("updateCursor prefecture:" + keyObj.prefecture);
        d.resolve(keyObj.prefecture);
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






