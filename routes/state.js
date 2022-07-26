var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
    //res.header("Access-Control-Allow-Origin", "*"); //allowOrigin);
    res.send('<script src="https://unpkg.zhimg.com/axios/dist/axios.min.js"></script>');
});

module.exports = router;
