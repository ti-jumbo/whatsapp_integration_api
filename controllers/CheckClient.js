const DBConnectionMenager = require('../database/DBConnectionMenager')
const { QueryTypes} = require('sequelize')

class CheckClient {
    static async checkClient (req, res) {
        try{
            console.log('a01')
            let codcli = await req.body.codcli
           
            console.log(codcli)
            if(codcli != null && codcli != undefined && codcli != '' && codcli != ' '){
                console.log('aq1')
                const checkClient = await DBConnectionMenager.getWhintorConnection().query(`
                    SELECT
                        CODCLI,
                        CODFILIAL,
                        CLIENTE,
                        TELCOB
                    FROM
                        PCCLIENT
                    WHERE
                        CODCLI = '${codcli}'
                        AND (CODUSUR1 = ${req.loggedUser.user_winthor_id} 
                        or CODUSUR2 = ${req.loggedUser.user_winthor_id })
                    `,
                    {
                        type: QueryTypes.SELECT
                    }
                )
               
                if (!checkClient.length) {
                    res.status(404).json({ message: 'Not found' }); 
                } else {
                    res.status(200).json(checkClient);
                }
            } else {
                res.status(400).json({ message: 'Invalid client code' });
            }
        } catch (e) {
            console.log(e);
            res.status(500).json({ message: 'Error' });
        }
    }
}

module.exports = CheckClient;