const{ Sequelize } = require('sequelize')
const{ QueryTypes } = require('sequelize');
const DBConnectionMenager = require('./src/database/DBConnectionMenager');

async function checkAcess(req, res, next){
    try{
        if(req.body.fone != null && req.body.fone != "") {
            const clientLogged = await DBConnectionMenager.getDefaultConnection().query(`
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
                next()
            }else{
                if(req.body.doc != null && req.body.doc != "") {
                    const client = await DBConnectionMenager.getWhintorConnection().query(`
                        SELECT 
                            CODCLI,CLIENTE,TELCOB,CGCENT ,
                            case 
                                when 
                                    to_number(regexp_replace(TELENT,'[^0-9]','')) = to_number(regexp_replace('${req.body.fone}','[^0-9]','')) 
                                    OR to_number(regexp_replace(TELCOB,'[^0-9]','')) = to_number(regexp_replace('${req.body.fone}','[^0-9]',''))
                                    OR to_number(regexp_replace(TELCOM,'[^0-9]','')) = to_number(regexp_replace('${req.body.fone}','[^0-9]','')) 
                                then 1
                                else 0
                            end  fonecorrect
                        FROM 
                            PCCLIENT 
                        WHERE 
                            to_number(regexp_replace(CGCENT,'[^0-9]','')) = to_number(regexp_replace('${req.body.doc}','[^0-9]',''))`,
                        {
                            type: QueryTypes.SELECT
                        }
                    );
                    console.log(client)
                    if(client.length > 0){
                        if(client[0].FONECORRECT){
                            const resultInsert = await DBConnectionMenager.getDefaultConnection().query(`
                                    INSERT INTO client_connection(
                                    phone_number,
                                    document
                                    )values(
                                    ${req.body.fone},${req.body.doc}
                            )`,
                                {
                                    type: QueryTypes.INSERT
                                }                            
                            )
                            console.log(resultInsert)
                            next()
                        }else{
                            res.status(401).json({message:'fone incorrect'})
                        }
                    }else{
                        res.status(401).json({message:'Client not exist'})                        
                    }
                }else {
                    res.status(401).json({message: 'missing identifir'})
                }
            }
            
        } else {
            res.status(401).json({message:'missing phone'})
        }
        
        
    }catch (error) {
        console.log(error)
        res.status(517).json(error)
    }

}
module.exports = checkAcess;
