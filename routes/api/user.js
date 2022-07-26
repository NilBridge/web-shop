var express = require('express');
const { getUser } = require('../../sqlite/utils');
var router = express.Router();

router.get("/",(req,res,next)=>{
    let userid = req.query.id;
    let type = isNaN(Number(req.query.type)) ? 1 : 0;
    if(userid == undefined){
        res.json({coed:404});
    }else{
        res.json({code:200,data:getUser(userid,type)});
    }
});

module.exports = router;