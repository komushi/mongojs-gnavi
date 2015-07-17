var express = require("express");
var jsonmask = require("json-mask");
var crawlerController = require("../controllers/crawlerController");



//configure routes
var router = express.Router();

/**************************/
/* REST API hello */
router.route('/api')
  .get(function (req, res) {
  res.send({routes: jsonmask(router.stack,"route/(path,stack/method)") });
  console.log("REST API is running.");
});
/* REST API hello */
/**************************/

/**************************/
/* REST API ensureIndex */
router.route('/api/restaurants')
  .put(function (req, res) {
    crawlerController.crawlRestaurants(req, res);
});
/* REST API ensureIndex */
/**************************/


module.exports=router;