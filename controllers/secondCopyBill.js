const{ QueryTypes } = require('sequelize');
const DBConnectionMenager = require('../database/DBConnectionMenager');


async function secondCopyBill() {
   
        
        const informationBill = await DBConnectionMenager.getWhintorConnection().query(
            `
            SELECT 
                NUMTRANS,
                CODCLI,
                DUPLIC,
                VALOR,
                DTVENC,
                DTEMISSAO,
                NUMDIASPRAZOPROTESTO,
                NOSSONUMBCO,
                LINHADIG,
                CODBARRA,
                VALORORIG,
                VLRTOTDESPESASEJUROS,
                VALORDESCORIG,
                CNPJRECEB,
                CNPJPAG
                    
            FROM 
                PCPREST
            WHERE
                 DUPLIC = 1226036              
                AND DTPAG IS NULL 
                AND DTBAIXA IS NULL 
                AND DTDESD IS NULL
            `,
            {
                type: QueryTypes.SELECT
            }
            
            );
            console.log(informationBill[0])
            return informationBill;
}


module.exports = secondCopyBill;