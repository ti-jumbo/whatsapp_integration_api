const { QueryTypes } = require("sequelize");
const DBConnectionMenager = require("../database/DBConnectionMenager");
const { type } = require("os");
const { SELECT } = require("sequelize/lib/query-types");


class CheckAcessController{
        static checkAcess(req, res, next) {
            console.log('init check whatsapp Acess midlleware');
            const basicText = req.headers.authorization?.split(' ')[0] || "";
            if(basicText != 'Basic'){
                return res.status(401).json()
            }
        const base64Credentials = req.headers.authorization?.split(' ')[1] || "";
        console.log('1',base64Credentials);
        const credentials = Buffer.from(base64Credentials,'base64').toString('ascii');
        console.log('2',credentials);
        const [username, password] = credentials.split(':');
        console.log('3',username, password);
        let user = process.env.CAUSER;
        let senha = process.env.CAPASSWORD;
        console.log('end check whatsapp Acess midlleware');
        if((username == user) && (password == senha)){
            next()
        } else {
             return res.status(401).json()
        }
    }


    static async checkAcessUser(req, res, next) {
        try{
            console.log('init checkAcess client midlleware');
            if(req.body.phone != null && req.body.phone != "") {
                let userLogged = await DBConnectionMenager.getDefaultConnection().query(`
                    SELECT * FROM user_connection
                    WHERE
                    PHONE_NUMBER = CAST(REGEXP_REPLACE('${req.body.phone}','[^0-9]','') AS DECIMAL(32))
                     `,
                    {
                        type: QueryTypes.SELECT
                    }
                );
                console.log(userLogged)
                if(userLogged.length > 0){
                    req.loggedUser = userLogged[0];
                    next()
                }else{

                    if(req.body.user_type != null && req.body.user_type != ""){
                        const userType = await DBConnectionMenager.getDefaultConnection().query(`
                        SELECT
                            *
                        FROM
                        user_types
                        WHERE
                        id = '${req.body.user_type}'
                            `,
                            {
                                type: QueryTypes.SELECT
                            }
                        )
                        if(userType.length > 0){
                            let query = userType[0].query_origin_identifer
                            if(req.body.doc != null && req.body.doc != "") {
                                query = query.replaceAll('__DOCUMENT__',req.body.doc);
                                query = query.replaceAll('__PHONE__',req.body.phone);
                                const user = await DBConnectionMenager.getWhintorConnection().query(
                                    query,
                                    {
                                        type: QueryTypes.SELECT
                                    }
                                )
                                if(user.length > 0){
                                    if(user[0].FONECORRECT) {
                                        const resultInsert = await DBConnectionMenager.getDefaultConnection().query(`
                                                INSERT INTO user_connection(
                                                    phone_number,
                                                    document,
                                                    user_winthor_id,
                                                    user_type_id
                                                )values(
                                                    cast(regexp_replace('${req.body.phone}','[^0-9]','') as decimal(32)),
                                                    cast(regexp_replace('${req.body.doc}','[^0-9]','') as decimal(32)),
                                                    ${user[0].USERID},
                                                    ${req.body.user_type}
                                                )`,
                                            {
                                                type: QueryTypes.INSERT
                                            }                             
                                        )
                                        console.log(resultInsert)
                                        userLogged = await DBConnectionMenager.getDefaultConnection().query(`
                                            SELECT * FROM user_connection
                                            WHERE
                                            ID = ${resultInsert[0]}  
                                            `,
                                            {
                                                type: QueryTypes.SELECT
                                            }
                                        )
                                        req.loggedUser = userLogged[0]; 
                                        next()
                                    }else {
                                        res.status(401).json({message:'phone incorrect'})
                                    }
                                }else{
                                    res.status(401).json({message:'user not exist'})                        
                                }
                            }else{
                                res.status(401).json({message: 'missing document'})
                            }
                        }else{
                            res.status(401).json({message: 'User Type not found'})
                        }
                    }else{
                        res.status(401).json({message: 'Missing user Type'})
                    }
                }
               
            
            }
        
        }catch (error) {
            console.log(error)
            res.status(517).json(error)
        }finally{
            console.log('end checkAcess midlleware');
        }
    }

}
module.exports = CheckAcessController;
                   