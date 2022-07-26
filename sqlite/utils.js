const {db} = require("./index");
const uuid = require("node-uuid");

db.exec(`create table if not exists SHOPS(
    ID INTEGER PRIMARY KEY AUTOINCREMENT,
    NAME TEXT,
    OWNER TEXT,
    TABLEID TEXT,
    CREATED INTEGER
);`);


db.exec(`create table if not exists USERS(
    ID INTEGER PRIMARY KEY AUTOINCREMENT,
    XUID TEXT,
    PWD TEXT,
    NAME TEXT,
    SHOP TEXT,
    HISTORY TEXT
);`);

function createShop(xuid,name){
    console.log(`正在为用户【${xuid}】 创建商店 【${name}】`);
    let has = hasSHOP(xuid);
    if(has.code == 0){
        let id = 'SHOP' + new Date().getTime().toString();
        db.prepare(`CREATE TABLE '${id}'(
            ID INTEGER PRIMARY KEY AUTOINCREMENT,
            NAME TEXT,
            MONEY INTERGE,
            NUMBER INTEGER,
            SNBT TEXT,
            PIC TEXT
        );`).run();
        // 设置玩家对应TABLEID
        db.prepare(`UPDATE USERS SET SHOP = @id WHERE XUID = @xuid;`).run({id,xuid});
        db.prepare(`INSERT INTO SHOPS VALUES (NULL,@name,@xuid,@id,@date);`).run({name,xuid,id,date:new Date().getTime()});
        console.log(`用户【${xuid}】创建商店成功，数据表：${id}`)
        return {success:true,id};
    }
    else{
        console.log(`用户【${xuid}】创建商店失败：已经拥有商店`);
        return {success:false,msg:has.msg};
    }
}

function exsitsSHOP_name(name){
    let p = db.prepare(`select * from SHOPS where NAME = '${name}';`).all();
    if(p.length > 0){
        return {has:true,count:p.length,shop_id:p[0].TABLEID,owner:p[0].OWNER};
    }else{
        return {has:false};
    }
}

function exsitsSHOP_ID(table_id){
    let p = db.prepare(`SELECT * FROM SHOPS WHERE TABLEID = '${table_id}';`).all();
    if(p.length > 0){
        return {has:true,owner:p[0].OWNER,name:p[0].NAME};
    }else{
        return {has:false};
    }
}

function remSHOP(xuid,pwd){
    let u = getUser(xuid);
    if(u.find){
        db.prepare(`DELETE FROM SHOPS WHERE TABLEID = @name;`).run({name:u.user.shop});
        db.prepare(`DROP TABLE @name;`).run({name:u.user.shop});
        return {success:true};
    }else{
        return {success:false,msg:'用户未找到'};
    }
}

function getSHOPITEMS(name){
    if(exsitsSHOP_ID(name).has){
        let o = db.prepare(`SELECT * FROM ${name};`).all();
        return o.map(formatITEM);
    }else if(exsitsSHOP_name(name).has){
        let o = getSHOP(exsitsSHOP_name(name).shop_id);
        return o;
    }else{
        return {};
    }
}


function getITEM(table_name,item_id){
    let p = db.prepare(`select * FROM ${table_name} WHERE ID = '${item_id}';`).all();
    if(p.length >0){
        return {find:true,item:formatITEM(p[0])};
    }
    return {find:false};
}
function formatITEM(it){
    return {id:it.ID,name:it.NAME,price:it.MONEY,count:it.NUMBER,pic:it.PIC==null?{has:false}:{has:true,pic:it.PIC}};
}

function shop_add_item(table_id,item_name,item_snbt,item_money,item_count,pic){
    let p = db.prepare(`INSERT INTO ${table_id} VALUES (NULL,@name,@money,@count,@snbt,@pic);`).run({name:item_name,snbt:item_snbt,money:item_money,count:item_count,pic});
    if(p.changes > 0){
        return {success:true};
    }else{
        return {success:false};
    }
}

function shop_remove_item(table_id,item_id,count = 0){
    let itt = getITEM(table_id,item_id);
    if(itt.find){
        if(count == 0){
            // 直接删除整个
            let p = db.prepare(`DELETE FROM ${table_id} WHERE ID = @id;`).run({id:item_id});
            return {success:p.changes > 0};
        }else{
            if(itt.item.count <= count){
                let p = db.prepare(`UPDATE FROM ${table_id} SET NUMBER = NUMBER - ${count} WHERE ID = @id;`).run({id:item_id});
                return {success:p.changes > 0};
            }else{
                return {success:false,msg:'商店里没有那么多'};
            }
        }
    }else{
        return {success:false,msg:'没有这个物品'};
    }
}

function formatUSER(u){
    return {xuid:u.XUID,name:u.NAME,shop:{has:u.SHOP != null,name:u.SHOP == null?undefined:u.SHOP},history:JSON.parse(u.HISTORY)};
}

function getUser(uid,type){
    switch(type){
        case 0: //use name
            let p1 =  db.prepare(`select * from USERS WHERE NAME = '${uid}';`).all();
            if(p1.length > 0){
                return {find:true,user:formatUSER(p1[0])};
            }else{
                return {find:false};
            }
            break;
        case 1:
            let p2 =  db.prepare(`select * from USERS WHERE XUID = '${uid}';`).all();
            if(p2.length > 0){
                return {find:true,user:formatUSER(p2[0])};
            }else{
                return {find:false};
            }
            break;
    }
}

function hasSHOP(xuid){
    let se = db.prepare(`SELECT * FROM USERS WHERE XUID = '${xuid}';`).all();
    if(se.length == 0){
        return {code:-1,msg:`没有用户的xuid为${xuid}`}
    }else{
        let user = se[0]; //XUID 不可能重复
        if(user.SHOP == null){
            return {code:0};
        }else{
            return {code:-2,msg:'用户已经建立了一个商店'}
        }
    }
}

function addUser(name,xuid,pwd){
    if(hasUser(xuid)){
        return {success:false,msg:'已经有同XUID 的用户了'};
    }
    db.prepare(`INSERT INTO USERS VALUES (NULL,@xuid,@pwd,@name,NULL,'[]');`).run({name,xuid,pwd});
    return {success:true};
}

function remUser(xuid){
    let user = getUser(xuid,1);
    if(user.find){
        let p = db.prepare(`DELETE FROM USERS WHERE XUID = @xuid;`).run({xuid});
        return {success:p.changes > 0};
    }else{
        return {success:false,msg:'用户未找到'};
    }

}

function hasUser(xuid){
    let p = db.prepare(`select * from USERS WHERE XUID = '${xuid}';`).all();
    return p.length > 0;
}

module.exports = {
    getSHOPITEMS,
    getUser,
    getITEM,
    remSHOP,
    remUser,
    addUser,
    createShop,
    shop_add_item,
    shop_remove_item,
    exsitsSHOP_ID,
    exsitsSHOP_name
}
