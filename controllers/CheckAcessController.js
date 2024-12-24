const { QueryTypes } = require("sequelize");
const DBConnectionMenager = require("../database/DBConnectionMenager");
const EndPointController = require("./EndPointController")

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
            console.log(req.url)
            for(let i =0 ; i <  EndPointController.getunRestrictEndPoints().length; i++){
                if(EndPointController.getunRestrictEndPoints()[i].endPoint == req.url){
                    console.log('unRestrictEndPoint')
                    return next()
                }
                
            }
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
                            if(req.body.document != null && req.body.document != "") {
                                query = query.replaceAll('__DOCUMENT__',req.body.document);
                                query = query.replaceAll('__PHONE__',req.body.phone);
                                const user = await DBConnectionMenager.getWhintorConnection().query(
                                    query,
                                    {
                                        type: QueryTypes.SELECT
                                    },
                                    
                                )
                                console.log('AAAA',user[0].CODFILIAL)
                                if(user.length > 0){
                                    if(user[0].FONECORRECT) {
                                        const resultInsert = await DBConnectionMenager.getDefaultConnection().query(`
                                                INSERT INTO user_connection(
                                                    phone_number,
                                                    document,
                                                    user_winthor_id,
                                                    user_type_id,
                                                    cod_filial
                                                )values(
                                                    cast(regexp_replace('${req.body.phone}','[^0-9]','') as decimal(32)),
                                                    cast(regexp_replace('${req.body.document}','[^0-9]','') as decimal(32)),
                                                    ${user[0].USERID},
                                                    ${req.body.user_type},
                                                    ${user[0].CODFILIAL}

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
                                        res.status(401).json({message: req.url == '/api/user/login' ? 'phone incorrect': 'user not logged'})
                                    }
                                }else{
                                    res.status(401).json({message: req.url == '/api/user/login' ? 'user not exist': 'user not logged'})                        
                                }
                            }else{
                                res.status(401).json({message: req.url == '/api/user/login' ? 'missing document': 'user not logged'})
                            }
                        }else{
                            res.status(401).json({message: req.url == '/api/user/login' ? 'user Type not found': 'user not logged'})
                        }
                    }else{
                        res.status(401).json({message: req.url == '/api/user/login' ? 'missing user type': 'user not logged'})        
                    }
                }
               
            
            }else{
                res.status(401).json({message: 'missing phone number'})
                
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
                   