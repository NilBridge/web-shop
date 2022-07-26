var express = require('express');
var router = express.Router();
const {db} = require('../../sqlite');
const {getSHOPITEMS,getUser} = require("../../sqlite/utils");

router.get('/',(req,res,next)=>{
    let page =Number(req.query.page);
    if(isNaN(page)){
        page = 1;
    }
    let p = db.prepare(`select * from SHOPS limit ${(page - 1) *10},10;`).all();
    let out = {code:200,date:new Date().getTime(),data:[]};
    p.forEach(i=>{
        let its = getSHOPITEMS(i.TABLEID);
        out.data.push({
            name:i.NAME,
            owner: getUser(i.OWNER,1).user.name,
            items:its.length
        });
    });
    res.json(out);
})

module.exports = router;