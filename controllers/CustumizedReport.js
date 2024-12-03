const { QueryTypes } = require('sequelize');
const DBConnectionMenager = require('../database/DBConnectionMenager');

require('dotenv').config

class CustumizedReport {

    static async salesDisruption(req, res) {
        const date = req.body.date;
        let option = req.body.option;
        let day;

        if (date !== null & date !== undefined & date !== '' & date !== ' ' & option !== null & option !== undefined & option !== '' & option !== ' ') {
            switch (option) {
                case "1":
                    day = 30
                    break;
                case "2":
                    day = 45
                    break;
                case "3":
                    day = 60
                    break;
                default:
                    res.status(400).json('Option invalid')
                    break;

            }
            
            let regex = /^\d{4}-\d{2}-\d{2}$/;

            // Verifica se a data está no formato correto e se é válida
            if (regex.test(date)) {
                let parsedDate = new Date(date);

                if (parsedDate.getTime() > 0) {

                    parsedDate = new Date(parsedDate);
                    parsedDate.setDate(parsedDate.getDate() - await day);
                    let formattedDate = parsedDate.toLocaleDateString('pt-BR');

                    let startDate = new Date(parsedDate);
                    startDate.setDate(parsedDate.getDate() + 1);
                    let formattedStartDate = startDate.toLocaleDateString('pt-BR');

                    let endDate = new Date(parsedDate);
                    endDate.setDate(parsedDate.getDate() + await day);
                    let formattedEndDate = endDate.toLocaleDateString('pt-BR');

                    //console.log("Date:", formattedDate);
                    //console.log("Start Date:", formattedStartDate);
                    //console.log("End Date:", formattedEndDate);



                    let response = await DBConnectionMenager.getWhintorConnection().query(`
            SELECT
            *
        FROM
            (
                SELECT
                    s.codcliente                                                    codcli,
                    cl_ps.coddocidentificador                                       cnpj,
                    cl_ps.nomerazao                                                 cliente,
                    cl_ps.fantasia                                                  fantasia,
                    cl_ps.endereco
                    || ','
                    || cl_ps.numero
                    || '-'
                    || cl_ps.bairro
                    || '-'
                    || cl_ps_ci.nome
                    || '-'
                    || cl_ps_ci.uf                                                  endereco,
                    regexp_replace(cl_ps.TELEFONE, '[^0-9]', '') AS telefone,

                    CASE 
                        WHEN regexp_replace(JP.TELCOB, '[^0-9]', '') NOT IN (
                            regexp_replace(cl_ps.TELEFONE, '[^0-9]', ''),
                            regexp_replace(jp.telcom, '[^0-9]', ''),
                            regexp_replace(jp.telent, '[^0-9]', ''),
                            regexp_replace(jp.telcelent, '[^0-9]', '')
                        ) THEN regexp_replace(JP.TELCOB, '[^0-9]', '')
                        ELSE NULL
                    END AS telefone2,

                    CASE 
                        WHEN regexp_replace(jp.telcom, '[^0-9]', '') NOT IN (
                            regexp_replace(cl_ps.TELEFONE, '[^0-9]', ''),
                            regexp_replace(JP.TELCOB, '[^0-9]', ''),
                            regexp_replace(jp.telent, '[^0-9]', ''),
                            regexp_replace(jp.telcelent, '[^0-9]', '')
                        ) THEN regexp_replace(jp.telcom, '[^0-9]', '')
                        ELSE NULL
                    END AS telefone3,

                    CASE 
                        WHEN regexp_replace(jp.telent, '[^0-9]', '') NOT IN (
                            regexp_replace(cl_ps.TELEFONE, '[^0-9]', ''),
                            regexp_replace(JP.TELCOB, '[^0-9]', ''),
                            regexp_replace(jp.telcom, '[^0-9]', ''),
                            regexp_replace(jp.telcelent, '[^0-9]', '')
                        ) THEN regexp_replace(jp.telent, '[^0-9]', '')
                        ELSE NULL
                    END AS telefone4,

                    CASE 
                        WHEN regexp_replace(jp.telcelent, '[^0-9]', '') NOT IN (
                            regexp_replace(cl_ps.TELEFONE, '[^0-9]', ''),
                            regexp_replace(JP.TELCOB, '[^0-9]', ''),
                            regexp_replace(jp.telcom, '[^0-9]', ''),
                            regexp_replace(jp.telent, '[^0-9]', '')
                        ) THEN regexp_replace(jp.telcelent, '[^0-9]', '')
                        ELSE NULL
                    END AS telefone5,
                    CASE
                        WHEN s.dtemissao BETWEEN TO_DATE('${formattedDate}', 'dd/mm/yyyy') AND TO_DATE('${formattedDate}', 'dd/mm/yyyy') THEN
                            'De ${formattedDate} a ${formattedDate}'
                        WHEN s.dtemissao BETWEEN TO_DATE('${formattedStartDate}', 'dd/mm/yyyy') AND TO_DATE('${formattedEndDate}', 'dd/mm/yyyy') THEN
                            'De ${formattedStartDate} a ${formattedEndDate}'
                        ELSE
                            'INDEFINED'
                    END                                                             periodos,
                    ( nvl(ms.qtsaida, 0) ) * coalesce(ms.pesoliqun, p.pesoliqun, 1) peso
                FROM
                        ep.epnfssaida s
                    JOIN ep.epmovimentacoessaida ms ON ms.codnfsaida = s.cod
                                                    AND ms.codoper IN ( 11 )
                                                    AND ms.dtcancel IS NULL
                    LEFT OUTER JOIN ep.epprodutos           p ON p.cod = ms.codprod
                    LEFT OUTER JOIN ep.epvendedores          v ON v.cod = s.codvendedor
                    LEFT OUTER JOIN ep.eptrabalhadores      v_tr ON v_tr.cod = v.codtrabalhador
                    LEFT OUTER JOIN ep.epclientes           cl ON cl.cod = s.codcliente
                    LEFT OUTER JOIN ep.eppessoas            cl_ps ON cl_ps.cod = cl.codpessoa
                    LEFT OUTER JOIN ep.epcidades            cl_ps_ci ON cl_ps_ci.cod = cl_ps.codcidade
                    LEFT OUTER JOIN jumbo.pcclient          jp      on  jp.codcli = s.codcliente
                WHERE
                    ( s.dtemissao BETWEEN TO_DATE('${formattedDate}', 'dd/mm/yyyy') AND TO_DATE('${formattedDate}', 'dd/mm/yyyy')
                    OR s.dtemissao BETWEEN TO_DATE('${formattedStartDate}', 'dd/mm/yyyy') AND TO_DATE('${formattedEndDate}', 'dd/mm/yyyy') )
                    AND s.dtcancel IS NULL
                    AND nvl(s.codcliente, - 1) NOT IN ( 1919, 2848, 28309 )
                    AND nvl(v.contabilizarvendas, 0) = 1
                UNION ALL
                
                SELECT
                    e.codcliente                                     codcli,
                    cl_ps.coddocidentificador                        cnpj,
                    cl_ps.nomerazao                                  cliente,
                    cl_ps.fantasia                                   fantasia,
                    cl_ps.endereco
                    || ','
                    || cl_ps.numero
                    || '-'
                    || cl_ps.bairro
                    || '-'
                    || cl_ps_ci.nome
                    || '-'
                    || cl_ps_ci.uf                                   endereco,
                     regexp_replace(cl_ps.TELEFONE, '[^0-9]', '') AS telefone,

                    CASE 
                        WHEN regexp_replace(JP.TELCOB, '[^0-9]', '') NOT IN (
                            regexp_replace(cl_ps.TELEFONE, '[^0-9]', ''),
                            regexp_replace(jp.telcom, '[^0-9]', ''),
                            regexp_replace(jp.telent, '[^0-9]', ''),
                            regexp_replace(jp.telcelent, '[^0-9]', '')
                        ) THEN regexp_replace(JP.TELCOB, '[^0-9]', '')
                        ELSE NULL
                    END AS telefone2,

                    CASE 
                        WHEN regexp_replace(jp.telcom, '[^0-9]', '') NOT IN (
                            regexp_replace(cl_ps.TELEFONE, '[^0-9]', ''),
                            regexp_replace(JP.TELCOB, '[^0-9]', ''),
                            regexp_replace(jp.telent, '[^0-9]', ''),
                            regexp_replace(jp.telcelent, '[^0-9]', '')
                        ) THEN regexp_replace(jp.telcom, '[^0-9]', '')
                        ELSE NULL
                    END AS telefone3,

                    CASE 
                        WHEN regexp_replace(jp.telent, '[^0-9]', '') NOT IN (
                            regexp_replace(cl_ps.TELEFONE, '[^0-9]', ''),
                            regexp_replace(JP.TELCOB, '[^0-9]', ''),
                            regexp_replace(jp.telcom, '[^0-9]', ''),
                            regexp_replace(jp.telcelent, '[^0-9]', '')
                        ) THEN regexp_replace(jp.telent, '[^0-9]', '')
                        ELSE NULL
                    END AS telefone4,

                    CASE 
                        WHEN regexp_replace(jp.telcelent, '[^0-9]', '') NOT IN (
                            regexp_replace(cl_ps.TELEFONE, '[^0-9]', ''),
                            regexp_replace(JP.TELCOB, '[^0-9]', ''),
                            regexp_replace(jp.telcom, '[^0-9]', ''),
                            regexp_replace(jp.telent, '[^0-9]', '')
                        ) THEN regexp_replace(jp.telcelent, '[^0-9]', '')
                        ELSE NULL
                    END AS telefone5,

                    CASE
                        WHEN e.dtemissao BETWEEN TO_DATE('${formattedDate}', 'dd/mm/yyyy') AND TO_DATE('${formattedDate}', 'dd/mm/yyyy') THEN
                            'De ${formattedDate} a ${formattedDate}'
                        WHEN e.dtemissao BETWEEN TO_DATE('${formattedStartDate}', 'dd/mm/yyyy') AND TO_DATE('${formattedEndDate}', 'dd/mm/yyyy') THEN
                            'De ${formattedStartDate} a ${formattedEndDate}'
                        ELSE
                            'INDEFINED'
                    END                                              periodos,
                    (
                        CASE
                            WHEN nvl(me.qtdevolvida, 0) > 0 THEN
                                me.qtdevolvida
                            ELSE
                                nvl(me.qtent, 0)
                        END
                        * - 1 ) * coalesce(me.pesoliqun, p.pesoliqun, 1) peso
                FROM
                        ep.epnfsent e
                    JOIN ep.epmovimentacoesent me ON me.codnfent = e.cod
                                                    AND me.codoper IN ( 4 )
                                                    AND me.dtcancel IS NULL
                    LEFT OUTER JOIN ep.epprodutos         p ON p.cod = me.codprod
                    LEFT OUTER JOIN ep.epvendedores       v ON v.cod = e.codvendedor
                    LEFT OUTER JOIN ep.eptrabalhadores    v_tr ON v_tr.cod = v.codtrabalhador
                    LEFT OUTER JOIN ep.epclientes         cl ON cl.cod = e.codcliente
                    LEFT OUTER JOIN ep.eppessoas          cl_ps ON cl_ps.cod = cl.codpessoa
                    LEFT OUTER JOIN ep.epcidades          cl_ps_ci ON cl_ps_ci.cod = cl_ps.codcidade
                    LEFT OUTER JOIN jumbo.pcclient          jp      on  jp.codcli = e.codcliente
                WHERE
                    ( e.dtemissao BETWEEN TO_DATE('${formattedDate}', 'dd/mm/yyyy') AND TO_DATE('${formattedDate}', 'dd/mm/yyyy')
                    OR e.dtemissao BETWEEN TO_DATE('${formattedStartDate}', 'dd/mm/yyyy') AND TO_DATE('${formattedEndDate}', 'dd/mm/yyyy') )
                    AND e.dtcancel IS NULL
                    AND nvl(e.codcliente, - 1) NOT IN ( 1919, 2848, 28309 )
                    AND nvl(v.contabilizarvendas, 0) = 1
                    
                    
            ) PIVOT (
                SUM(nvl(peso, 0))
            AS peso
                FOR periodos
                IN ( 'De ${formattedDate} a ${formattedDate}',
                'De ${formattedStartDate} a ${formattedEndDate}' )
    )
        `,  {
                type: QueryTypes.SELECT
            });
                    let result = [];
                    if (response.length > 0) {
                        let i;
                        for (i = 0; i < response.length; i++) {
                            let objectkeys = Object.keys(response[i])
                            let colvalname2 = objectkeys[objectkeys.length - 2]
                            let colvalname = objectkeys[objectkeys.length - 1]
                            if (response[i][colvalname2] != null & response[i][colvalname] == null) {
                                result.push(response[i]);
                            } else {
                                null
                            }
                        }
                        //console.log(result)
                        res.status(200).json(result)
                    };
                } else {
                    //console.log("Data inválida!");
                    res.status(400).json({message: "Data inválida!"});
                }
            } else {
               //console.log("Formato de data inválido!");
                res.status(400).json({message: "Formato de data inválido!"});
            }
        } else {
            res.status(400).json('Parameter invalid')
        }
    }
}

module.exports = CustumizedReport;