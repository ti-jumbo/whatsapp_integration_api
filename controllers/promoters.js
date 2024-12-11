const { QueryTypes } = require("sequelize");
const DBConnectionMenager = require("../database/DBConnectionMenager");

class promoters{
    static async promoter(req, res){
        try{
            if(req.body.phone != "" && req.body.phone != " "){
                const db = await DBConnectionMenager.getDefaultConnection().query(`
                    SELECT 
                        *
                    FROM
                        PROMOTERS
                    WHERE 
                        CAST(REGEXP_REPLACE(TELEFONE, '[^0-9]', '') AS UNSIGNED) = CAST(REGEXP_REPLACE('${req.body.phone}', '[^0-9]', '') AS UNSIGNED);
                    `,
                    {
                        type: QueryTypes.SELECT
                    }
                );
                if(db.length > 0){
                    console.log(db)
                    res.status(200).json(db)
                }else{
                    res.status(401).json("Unathorized")
                }
            }else{
            res.status(400).json("phone is required")
            }
        }catch(e){
            console.log(e)
            res.status(400).json(e)
        }
    }
}
module.exports = promoters;