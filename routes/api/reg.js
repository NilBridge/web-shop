var express = require('express');
const { addUser } = require('../../sqlite/utils');
var router = express.Router();


router.post("/",(req,res,next)=>{
    let data =req.body;
    if(data.xuid && data.name && data.pwd){
        let r = addUser(data.name,data.xuid,data.pwd);
        if(r.success){
            res.json({code:200});
        }else{
            res.json({code:400,msh:r.msg});
        }
    }else{
        res.json({code:400,msg:'缺失参数'});
    }
});

module.exports = router;