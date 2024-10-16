const{ Sequelize } = require('sequelize')
const{ QueryTypes } = require('sequelize');
const DBConnectionMenager = require('./app/database/DBConnectionMenager');
const { types } = require('util');

async function openTitles(req, res, next) {
    try {
        const duplicate = await DBConnectionMenager.getWhintorConnection().query(`
            SELECT 
                C.CODCLI,
                P.DUPLIC,
                P.PREST,
                P.VALOR
                
            FROM 
                PCCLIENT C
                JOIN PCPREST P ON P.CODCLI = C.CODCLI
            WHERE
                to_number(regexp_replace(C.CGCENT,'[^0-9]','')) = to_number(regexp_replace('${req.loggedUser.document}','[^0-9]','')) 
                AND P.DTPAG IS NULL 
                AND P.DTBAIXA IS NULL 
                AND P.DTDESD IS NULL
            `,
            {
                type: QueryTypes.SELECT
            }
        );
        console.log(duplicate)
        res.status(200).json(duplicate)

    } catch (error) {
        console.log(error)
        res.status(517).json(error)
    }
    
}
module.exports = openTitles;