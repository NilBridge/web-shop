var express = require('express');
var router = express.Router();
var {exsitsSHOP_ID,exsitsSHOP_name,getSHOPITEMS,getUser} = require("../../sqlite/utils");

/* GET users listing. */
router.get('/', function(req, res, next) {
  console.log('正在查询商铺：',req.query.shop);
  let shopname = decodeURI(req.query.shop);
  if(exsitsSHOP_ID(shopname).has){
    let h = exsitsSHOP_ID(shopname);
    res.json({code:200,data:{owner:getUser(h.owner,1).user.name,items:getSHOPITEMS(shopname)}});
  }else if (exsitsSHOP_name(shopname).has){
    let s = exsitsSHOP_name(shopname);
    res.json({code:200,data:{owner:getUser(s.owner,1).user.name,items:getSHOPITEMS(s.shop_id)}});
  }else{
    res.json({code:404});
  }
});

module.exports = router;
