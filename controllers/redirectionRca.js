const { QueryTypes } = require('sequelize')
const DBConnectionMenager = require('../database/DBConnectionMenager')

require('dotenv').config()


class redirectionRca{

    static async redirection(req, res) {
        let codcli = req.body.codcli;
    
        try {
            if (codcli != "" && codcli != null && codcli != " ") {
                const response = await DBConnectionMenager.getWhintorConnection().query(
                    `
                    SELECT
                        PC.CODCLI,
                        PC.CLIENTE,
                        PC.CODUSUR1,
                        PU.NOME,
                        PU.EMAIL,
                        PU.TELEFONE1,
                        PU.TELEFONE2,
                        CASE
                            WHEN TELEFONE1 IS NULL AND TELEFONE2 IS NULL THEN 'NÃO POSSUI'
                            ELSE 'POSSUI'
                        END AS resultado
                    FROM
                        pcclient PC
                        JOIN pcusuari PU ON (
                        PC.CODUSUR1 = PU.CODUSUR
                        )
                    WHERE
                        CODCLI = ${codcli}
                        AND CODUSUR1 != 150
                        AND CODUSUR1 IS NOT NULL
                    `,
                    {
                        type: QueryTypes.SELECT
                    }
                );
                console.log(response)
                // Verificar se a resposta tem dados e se o resultado é 'POSSUI'
                if (response.length > 0 && response[0].RESULTADO === 'POSSUI') {
                    res.status(200).json(response);
                } else {
                    res.status(400).json('codcli not exists or does not have phone');
                }
            } else {
                res.status(400).json('missing codcli');
            }
        } catch (e) {
            console.log(e);
            res.status(500).json(e);
        }
    }
}    
module.exports = redirectionRca;