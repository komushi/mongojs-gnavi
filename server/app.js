//****************************************
// 1. Register access key from gnavi, put the key in manifest.yml
// 2. Create PWS or Bluemix account
// 3. Create mongodb service named "gnavi_mongo", put the name in manifest.yml
// 4. Push this app to PWS or Bluemix
// curl http://<host>/api/crawlGnavi?area=PREF01
// PREF01~47 means from Hokkaido to Okinawa
//****************************************

/**************************/
/* config */
var application_root = __dirname;
var express = require("express");
var path = require("path");
var bodyParser = require('body-parser');
var routes = require('./routes/routes');
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

app.disable('etag'); 
app.use(allowCrossDomain);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ 
   extended: true 
}));

//app.use(express.static(path.join(application_root, "../client")));

app.use('/', routes);
/* config */
/**************************/

var server = app.listen((process.env.PORT || 9000), function() {
  console.log('Express server listening on port ' + server.address().port);
});


