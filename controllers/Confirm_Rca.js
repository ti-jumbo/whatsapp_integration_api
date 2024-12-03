const { Sequelize } = require('sequelize');
const { QueryTypes } = require('sequelize');
const DBConnectionMenager = require('../database/DBConnectionMenager');
const { SELECT } = require('sequelize/lib/query-types');



class Confirm_Rca {
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
    let user = 'whatsappEZ';
    let senha = '##token#!whatsapp!#ez$@Jumbo%&*';
    console.log('end check whatsapp Acess midlleware');
    if((username == user) && (password == senha)){
        next()
    } else {
         return res.status(401).json()
    }
    }
    
    static async checkRca(req, res, next) {
        try {
            if(req.body.phone != null && req.body.phone != "") {
                let rcaLogged = await DBConnectionMenager.getDefaultConnection().query(`
                    SELECT 
                        *
                     FROM 
                        seller_rca
                    WHERE
                    fone = CAST(REGEXP_REPLACE('${req.body.phone}','[^0-9]','') AS DECIMAL(32))  
                     `,
                    {
                        type: QueryTypes.SELECT
                    }
                )
                console.log(rcaLogged)
                if(rcaLogged.length > 0){
                    req.loggedUser = rcaLogged[0];
                    next()
            } else {
                if (req.body.coduser != null && req.body.coduser !== "") {
                    const RCA = await DBConnectionMenager.getWhintorConnection().query(`
                        SELECT 
                            CODUSUR,
                            TELEFONE1,
                            TELEFONE2,
                            NOME,
                            CASE 
                                WHEN 
                                    TO_NUMBER(REGEXP_REPLACE(TELEFONE1,'[^0-9]','')) = TO_NUMBER(REGEXP_REPLACE('${req.body.phone}', '[^0-9]', '')) 
                                    OR TO_NUMBER(REGEXP_REPLACE(TELEFONE2,'[^0-9]','')) = TO_NUMBER(REGEXP_REPLACE('${req.body.phone}', '[^0-9]', ''))
                                THEN 1
                                ELSE 0
                            END AS phonecorrect
                        FROM 
                            PCUSUARI
                        WHERE 
                            codusur = ${req.body.coduser}`,
                        {
                            
                            type: QueryTypes.SELECT
                        }
                    );
                    console.log(RCA);
                    if (RCA.length > 0) {
                        if (RCA[0].PHONECORRECT) {
                            const resultInsert = await DBConnectionMenager.getDefaultConnection().query(`
                                INSERT INTO seller_rca(
                                    codrca,
                                    phone
                            
                                ) VALUES (
                                    CAST(REGEXP_REPLACE('${req.body.coduser}','[^0-9]','') AS DECIMAL(32)),
                                    CAST(REGEXP_REPLACE('${req.body.phone}','[^0-9]','') AS DECIMAL(32))
                                    
                                )`,
                                {
                                    type: QueryTypes.INSERT
                                }
                            );

                            console.log(resultInsert);

                            const Check_Rca = await DBConnectionMenager.getDefaultConnection().query(`
                                SELECT
                                    *
                                FROM 
                                    seller_rca
                                WHERE
                                    ID = ${resultInsert[0]}`,
                                {
                                    
                                    type: QueryTypes.SELECT
                                }
                            );

                            req.loggedRca = Check_Rca[0]; 
                             next();
                        } else {
                            return res.status(401).json({ message: 'phone incorrect' });
                        }
                    } else {
                        return res.status(401).json({ message: 'Client not exist' });
                    }
                } else {
                    return res.status(401).json({ message: 'missing identifier' });
                }
            } 
        } else {
            res.status(401).json({message:'missing phone'})
        }
        } catch (error) {
            console.log(error);
            return res.status(517).json(error);
        } finally {
            console.log('end checkAccess client middleware');
            res.status(200).json()
        }
    }
}
module.exports = Confirm_Rca;
