const DBConnectionMenager = require('../database/DBConnectionMenager');
const {sequelize, QueryTypes} = require('sequelize')

require('dotenv').config()


class bonus{
    static async bonif(req, res){
        try{
        const response = await DBConnectionMenager.getWhintorConnection().query(`
           SELECT 
                DISTINCT
                PS.NUMNOTA,
                PS.CODUSUR,
                PS.VLTOTAL,
                PS.CODFILIAL,
                PS.CODCLI,
                PS.DTSAIDA,
                PM.CODOPER
            FROM
                PCNFSAID PS
                LEFT OUTER JOIN PCMOV PM ON PS.NUMTRANSVENDA = PM.NUMTRANSVENDA
            WHERE
                PS.CODUSUR = '${req.body.coduser}'
                AND PS.CODCLI = '${req.body.codcli}'
                AND PS.DTSAIDA > TO_DATE('${req.body.startdate}', 'DD/MM/YYYY')
                AND PS.DTSAIDA < TO_DATE('${req.body.enddate}', 'DD/MM/YYYY')
                AND PM.CODOPER = 'SB';

    
            `,
            {
                type: QueryTypes.SELECT
            }
        )
            let date = response
            res.status(200).json(date)
        }catch(e){
            console.log(e)
            res.status(500).json(e)
        }
    }
    }
module.exports = bonus;