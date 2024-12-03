const{ Sequelize } = require('sequelize')
const{ QueryTypes } = require('sequelize');
const DBConnectionMenager = require('../database/DBConnectionMenager');

async function checkAcess(req, res, next){
    try{
        console.log('init checkAcess client midlleware');
        if(req.body.phone != null && req.body.phone != "") {
            let clientLogged = await DBConnectionMenager.getDefaultConnection().query(`
                SELECT * FROM client_connection
                WHERE
                PHONE_NUMBER = ${req.body.fone}  
                 `,
                {
                    type: QueryTypes.SELECT
                }
            )
            console.log(clientLogged)
            if(clientLogged.length > 0){
                req.loggedUser = clientLogged[0];
                next()
            }else{
                if(req.body.document != null && req.body.document != "") {
                    const client = await DBConnectionMenager.getWhintorConnection().query(`
                        SELECT 
                            CODCLI,CLIENTE,TELCOB,CGCENT ,
                            case 
                                when 
                                    to_number(regexp_replace(TELENT,'[^0-9]','')) = to_number(regexp_replace('${req.body.phone}','[^0-9]','')) 
                                    OR to_number(regexp_replace(TELCOB,'[^0-9]','')) = to_number(regexp_replace('${req.body.phone}','[^0-9]',''))
                                    OR to_number(regexp_replace(TELCOM,'[^0-9]','')) = to_number(regexp_replace('${req.body.phone}','[^0-9]','')) 
                                then 1
                                else 0
                            end  phonecorrect
                        FROM 
                            PCCLIENT 
                        WHERE 
                            to_number(regexp_replace(CGCENT,'[^0-9]','')) = to_number(regexp_replace('${req.body.document}','[^0-9]',''))`,
                        {
                            type: QueryTypes.SELECT
                        }
                        
                    );
                    console.log(client)
                    if(client.length > 0){
                        if(client[0].FONECORRECT) {
                            const resultInsert = await DBConnectionMenager.getDefaultConnection().query(`
                                    INSERT INTO client_connection(
                                    phone_number,
                                    document
                                    )values(
                                    cast(regexp_replace('${req.body.phone}','[^0-9]','') as decimal(32)),
                                    cast(regexp_replace('${req.body.document}','[^0-9]','') as decimal(32))
                            )`,
                                {
                                    type: QueryTypes.INSERT
                                }                             
                            )
                            console.log(resultInsert)
                                clientLogged = await DBConnectionMenager.getDefaultConnection().query(`
                                SELECT * FROM client_connection
                                WHERE
                                ID = ${resultInsert[0]}  
                                 `,
                                {
                                    type: QueryTypes.SELECT
                                }
                            )
                            req.loggedUser = clientLogged[0]; 
                            next()
                        }else {
                            res.status(401).json({message:'fone incorrect'})
                        }
                    }else{
                        res.status(401).json({message:'User not exist'})                        
                    }
                }else {
                    res.status(401).json({message: 'User not logged'})
                }
            }
            
        } else {
            res.status(401).json({message:'missing phone'})
        }
        
        
    }catch (error) {
        console.log(error)
        res.status(517).json(error)
    }finally{
        console.log('end checkAcess client midlleware');
    }

}
module.exports = checkAcess;
