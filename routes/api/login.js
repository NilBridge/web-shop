var express = require('express');
const { addUser, user_pwd_right } = require('../../sqlite/utils');
var router = express.Router();


router.post("/",(req,res,next)=>{
    console.log(req.body)
    let data = req.body;
    if(data.xuid  && data.pwd){
        if(user_pwd_right(data.xuid,data.pwd)){
            res.json({code:200});
        }else{
            res.json({code:400});
        }
    }else{
        res.json({code:400,msg:'缺失参数'});
    }
});

module.exports = router;