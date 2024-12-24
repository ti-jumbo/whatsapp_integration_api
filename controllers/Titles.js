const{ QueryTypes } = require('sequelize');
const DBConnectionMenager = require('../database/DBConnectionMenager');


class Titles{

    static async openTitles(req, res, next) {
        try {
            const duplicate = await DBConnectionMenager.getWhintorConnection().query(`
                SELECT 
                    C.CODCLI,
                    P.CODFILIAL,
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
    static async unpaidTitle(req, res, next) {
        try{
       /* const validateDate = (date, format) => {
            const regexFormats = {
                'DD/MM/YYYY': /^\d{2}\/\d{2}\/\d{4}$/,
                'YYYY-MM-DD': /^\d{4}-\d{2}-\d{2}$/
            };
        
            // Verificar formato
            if (!regexFormats[format]?.test(date)) {
                return false;
            }
        
            // Verificar se a data é válida
            const [day, month, year] = format === 'DD/MM/YYYY'
                ? date.split('/').map(Number)
                : date.split('-').map(Number);
        
            const parsedDate = new Date(year, month - 1, day);
            return (
                parsedDate.getFullYear() === year &&
                parsedDate.getMonth() === month - 1 &&
                parsedDate.getDate() === day
            );
           
        };
        
        // Testando
    console.log(validateDate(`${req.body.date}`, "DD/MM/YYYY"));
    console.log(validateDate(`${req.body.date}`, "YYYY-MM-DD")) // true

        

    if (validateDate(req.body.date, 'DD/MM/YYYY')) {
        
            const formatDateToISO = (date) => {
                const [day, month, year] = date.split('/');
                return `${year}-${month}-${day}`;
            };
            
            if (validateDate(req.body.date, 'DD/MM/YYYY')) {
                req.body.date = formatDateToISO(req.body.date); // Reformata para YYYY-MM-DD
            }*/
                
            let response = await DBConnectionMenager.getWhintorConnection().query(`
                
                SELECT
                    PP.CODCLI,
                    PC.CLIENTE,
                    PC.TELCOB,
                    PC.TELCOM,
                    PC.TELENT,
                    PC.TELCELENT,
                    PP.PREST,
                    PP.DUPLIC,
                    PP.VALOR,
                    PP.VPAGO,
                    PP.CODCOB,
                    PP.OPERACAO,
                    PP.STATUS,
                    PP.dtemissao,
                    PP.DTVENC,
                    PP.LINHADIG,
                    CASE 
                        WHEN PP.DTVENC = TO_DATE('${req.body.date}', 'DD/MM/YYYY') + 1 THEN '-1'
                        WHEN PP.DTVENC = TO_DATE('${req.body.date}', 'DD/MM/YYYY') - 1 THEN '1'
                        WHEN PP.DTVENC = TO_DATE('${req.body.date}', 'DD/MM/YYYY') - 3 THEN '3'
                        WHEN PP.DTVENC = TO_DATE('${req.body.date}', 'DD/MM/YYYY') - 5 THEN '5'
                        WHEN PP.DTVENC = TO_DATE('${req.body.date}', 'DD/MM/YYYY') - 6 THEN '6'
                        ELSE 'DTVENC não corresponde a nenhuma das condições'
                    END AS MATURITY
                FROM
                    PCPREST PP 
                    INNER JOIN PCCLIENT PC on
                    PP.CODCLI = PC.CODCLI
                WHERE
                    pp.DTPAG IS NULL
                    AND pp.VPAGO IS NULL
                    AND pp.DTPAG IS NULL
                    AND pp.VPAGO IS NULL
                    AND pc.dtexclusao IS NULL
                    AND (DTVENC = TO_DATE('${req.body.date}', 'DD/MM/YYYY') + 1
                    or DTVENC = TO_DATE('${req.body.date}', 'DD/MM/YYYY') - 1
                    or DTVENC = TO_DATE('${req.body.date}', 'DD/MM/YYYY') - 3
                    or DTVENC = TO_DATE('${req.body.date}', 'DD/MM/YYYY') - 5
                    or DTVENC = TO_DATE('${req.body.date}', 'DD/MM/YYYY') - 6)
            
            `,
            {
                type: QueryTypes.SELECT
            }
            );
            const oneDayToWin = response.filter(response => response.MATURITY === "-1")
            const oneDayWon = response.filter(response => response.MATURITY === "1")
            const twoDayWon = response.filter(response => response.MATURITY === "3")
            const threeDayWon = response.filter(response => response.MATURITY === "5")
            const forDayWon = response.filter(response => response.MATURITY === "6")
            let day = req.body.option;
            if(day !== '' && day !== null && day !== undefined){
                switch(req.body.option){
                    case '1':
                        res.status(200).json(oneDayToWin)
                    break;
                    case '2':
                        res.status(200).json(oneDayWon)
                    break;
                    case '3':
                        res.status(200).json(twoDayWon)
                    break;
                    case '4':
                        res.status(200).json(threeDayWon)
                    break;
                    case '5':
                        res.status(200).json(forDayWon)
                    break;
                    default:
                    res.status(400).json({message: "Invalid day"})
                };
            }else{
                res.status(400).json({message: "parameter invalid"})
            }
        
    /*    
     }else {
        res.status(400).json({ message: "date invalid." });
    }  */
    } catch (e) {
        console.error("Error consult da:", e);
        res.status(500).json({ message: "Error requirements database." });
    }  
    }
}
module.exports = Titles;