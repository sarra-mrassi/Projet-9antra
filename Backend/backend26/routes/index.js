var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/bonjour ', function(req, res, next) {
  res.json( 'Express' );
});

module.exports = router;
