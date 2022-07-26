var express = require('express');
var router = express.Router();
const {getITEM,shop_remove_item, addMoney, exsitsSHOP_ID} = require("../../sqlite/utils");
const CryptoJS = require("../crypto-js");

// "Content-Type: application/json"

/* GET users listing. */
router.post('/',(req,res,next)=>{
    let data = req.body;
    if(data.xuid && data.shopid && data.itemid && data.count){
        let it = getITEM(data.shopid,data.itemid);
        if(it.find){
            if(it.item.count >= data.count){
                let shop_owner = exsitsSHOP_ID(data.shopid).owner;
                if(it.item.count == data.count){
                    addMoney(shop_owner,it.item.price * data.count);
                    shop_remove_item(data.shopid,data.itemid,0);
                }else{
                    shop_remove_item(data.shopid,data.itemid,data.count);
                    addMoney(shop_owner,it.item.price * data.count)
                }
                res.json({code:200});
            }else{
                res.json({code:400,msg:'商店中没有那么多'});
            }
        }else{
            res.json({code:404,msg:'找不到这个商品'});
        }
    }else{
        res.json({code:400,msg:"参数缺失"});
    }
});

function encryptByDES(message, key){
    var keyHex = CryptoJS.enc.Utf8.parse(key);
    var encrypted = CryptoJS.DES.encrypt(message, keyHex, {
        mode: CryptoJS.mode.ECB,
        padding: CryptoJS.pad.Pkcs7
    });
    return encrypted.ciphertext.toString();
}

function decryptByDES(ciphertext, key){
    var keyHex = CryptoJS.enc.Utf8.parse(key);
    var decrypted = CryptoJS.DES.decrypt({
        ciphertext: CryptoJS.enc.Hex.parse(ciphertext)
    }, keyHex, {
        mode: CryptoJS.mode.ECB,
        padding: CryptoJS.pad.Pkcs7
    });
    var result_value = decrypted.toString(CryptoJS.enc.Utf8);
    return result_value;
}

module.exports = router;
