require('dotenv').config
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
const pdf = require("html-pdf");

class campaignSynergy{
    static async getDatesSynergy(req,res){
        try{
            const reportData = {
                CRITPART:{
                    REPORTID:1
                },    
                DEVOLUCOES:
                {
                    REPORTID:3
                },
                RATINGS:
                {
                    REPORTID:2
                },
                POSITIVACAOCLI:
                {
                    REPORTID:4
                }
            };
            
            let contentLinesPillar = [];
            let contentLinesInf = [];
            let contentLinesdates = [];

            let month = req.body.month;
            let monthSelection;
                if(month != null && month != ' ' && month != '') {
                    if(month == '1'){
                        monthSelection = ["2024-01-01","2024-01-31"]
                    }
                    if(month == '2'){
                        monthSelection = ["2024-02-01","2024-02-29"]
                    }
                    if(month == '3'){
                        monthSelection = ["2024-03-01","2024-03-31"]
                    }
                    if(month == '4'){
                        monthSelection = ["2024-04-01","2024-04-30"]
                    }
                    if(month == '5'){
                        monthSelection = ["2024-05-01","2024-05-31"]
                    }
                    if(month == '6'){
                        monthSelection = ["2024-06-01","2024-06-30"]
                    }
                    if(month == '7'){
                        monthSelection = ["2024-07-01","2024-07-31"]
                    }
                    if(month == '8'){
                        monthSelection = ["2024-08-01","2024-08-31"]
                    }
                    if(month == '9'){
                        monthSelection = ["2024-09-01","2024-09-30"]
                    }
                    if(month == '10'){
                        monthSelection = ["2024-10-01","2024-10-31"]
                    }
                    if(month == '11'){
                        monthSelection = ["2024-05-01","2024-11-30"]
                    }
                    if(month == '12'){
                        monthSelection = ["2024-12-01","2024-12-31"]
                    }
                }
                console.log(monthSelection)
            for(let i in reportData) {
                console.log('xxxxxx', i , reportData[i])
                let options = {
                    method: 'post',
                    body: JSON.stringify({         
                        dates: monthSelection,
                        seller_ids:req.body.coduser,
                        ...reportData[i]
                    }),
                    headers:{
                        Accept:"application/json",
                        "Content-type":"application/json",
                        Authorization:process.env.AUTH
                    }
                };
                //console.log(reportData[i])
                const url = "http://192.168.2.151:3004/api/controllers/modules/reports/reportscontroller/get_data"
                const response = await fetch(url, options);
                const responseJson = await response.json();
            
               switch (reportData[i].REPORTID) {
                    case 1://criterio
                            contentLinesInf.push(`
                                    <tr>
                                        <td><text >NOME:  ${responseJson.data[0][`RCA`]}</text></td>
                                        <td><text >CODRCA:  ${responseJson.data[0][`CODRCA`]}</text></td>
                                        <td><text >SUPERVISOR:  ${responseJson.data[0][`SUPERVISOR`]}</text></td>
                                        <td><text >MES:  ${responseJson.data[0][`MES`]}</text></td>
                                    </tr>
                                `)        


                            let RestantePeso = responseJson.data[0][`'p1'_PESO`] - responseJson.data[0][`'p2'_PESO`]
                            let RestanteValor = responseJson.data[0][`'p1'_VALOR`] - responseJson.data[0][`'p2'_VALOR`]
                            contentLinesdates.push(`
                                <tr>
                                    <td><text class="content-center">Peso</text></td>
                                    <td><text class="content-center">${responseJson.data[0][`'p1'_PESO`].toLocaleString('pt-BR', { minimumIntegerDigits: 2, minimumFractionDigits: 2,maximumFractionDigits: 2 })}</text></td>
                                    <td><text class="content-center">${responseJson.data[0][`'p2'_PESO`].toLocaleString('pt-BR', { minimumIntegerDigits: 2, minimumFractionDigits: 2,maximumFractionDigits: 2 })}</text></td>
                                    <td><text class="content-center">${RestantePeso.toLocaleString('pt-BR', { minimumIntegerDigits: 2, minimumFractionDigits: 2,maximumFractionDigits: 2 })}</text></td>
                                </tr>
                                <tr>
                                    <td><text class="content-center">Valor</text></td>
                                    <td><text class="content-center">${responseJson.data[0][`'p1'_VALOR`].toLocaleString('pt-BR', { minimumIntegerDigits: 2, minimumFractionDigits: 2,maximumFractionDigits: 2 })}</text></td>
                                    <td><text class="content-center">${responseJson.data[0][`'p2'_VALOR`].toLocaleString('pt-BR', { minimumIntegerDigits: 2, minimumFractionDigits: 2,maximumFractionDigits: 2 })}</text></td>
                                    <td><text class="content-center">${RestanteValor.toLocaleString('pt-BR', { minimumIntegerDigits: 2, minimumFractionDigits: 2,maximumFractionDigits: 2 })}</text></td>
                                </tr>    
                                
                            `);
                        
                        break;
                        case 2:// rattings
                        console.log('xxxxxxxxxx ',responseJson.data[0])
                        for (let d in  responseJson.data[0]){
                              // Ensure proper checks
                            let pillarName = null;  
                            
                            if(d.indexOf('M_') === 0 && d != 'M_PESO'){
                                pillarName = d.substring(2)
                                contentLinesPillar.push(`
                                    <tr>
                                        <td><text class="content-center">${pillarName}</text></td>
                                        <td><text class="content-center">${responseJson.data[0][d].toLocaleString('pt-BR', { minimumIntegerDigits: 2, minimumFractionDigits: 2,maximumFractionDigits: 2 })}</text></td>
                                        <td><text class="content-center">${responseJson.data[0][`V_${pillarName}`]}</text></td>
                                        <td><text class="content-center">${responseJson.data[0][`P_${pillarName}`]}</text></td>
                                    </tr>
                                `);
                            }
                        };
                        break;
                        case 3://devolução
                           
                        break;
                        case 4: //POSITIVAÇÃOI

                        break;
                    default:
                        break;
                }
                
            }
            
            let content = `<!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Document</title>
                <style>
            table {
            width: calc(100% - 2cm);
            border-collapse: collapse;
            margin: 1cm;
            }
            tbody {
            width: 100%;
            }
            tr {
            width: 100%;
            }
            td {
            font-size: 14;
            font-weight: bolder;
            border: 1px solid black;
            vertical-align: top;
            }
            td.notbordered {
            border: none !important
            }
            td text.header {
            display: block;
            font-size: 8;    
            }
            td text.content {
            display: block;
            }
            td text.content-center {
            text-align: center;
            display: block;
            }
            td.first {
            width: 4cm;
            }
            td.align {
            text-align: right;
            width:5%;
            }
            td.last {
            width: 6cm;
            }
            td.last text.content {
            text-align: right;
            width: 100%;
            }
            td.container img {
            max-width:4cm;
            max-height:2cm;
            }
            #Color-intuitive{
                width: 200px;
                height: 200px;
                background-color: lightgray;
            }
            </style>

            </head>
            <body>
        
            
                <table>
                    <h1 style="text-align: center;">Campanha Sinergia</h1>
                    <tr>
                        <tbody>
                        ${contentLinesInf.join("")}
                        </tbody>
                    </tr>
                </table>
                <table>
                    <h2 style="text-align: center;">Criterio de participação</h2>
                    <tr>
                        <td class="notbordered">
                            <text class="content-center">
                            
                            </text>
                        </td>
                        <td>
                            <text class="content-center">
                                Anterior
                            </text>
                        </td>
                        <td>
                            <text class="content-center">
                                Atual
                            </text>
                        </td>
                        <td>
                            <text class="content-center">
                                Restante para objetivo
                            </text>
                    </tr>
                        ${contentLinesdates.join("")}
                </table>
                <table>
                    <tr>
                        <td class="notbordered">
                            <text  class="content-center">
                            Pilar
                            </text>
                        </td>
                        <td>
                            <text class="content-center">
                                Média
                            </text>
                        </td>
                        <td>
                            <text class="content-center">
                                Realizado
                            </text>
                        </td>
                        <td>
                            <text class="content-center">
                                Pontos
                            </text>
                        </td>
                    </tr>
                    <tbody>
                    ${contentLinesPillar.join("")}
                    <tbody>
                </table>
            </body>
        </html>
    `;
            pdf.create(content, {
            }).toFile("./SynergyCampaign.pdf",(err,res) => {
                if(err){
                    console.log('erro :(');
                }else{
                    console.log(res);
                }
            })
            res.status(200).send(content)
        } catch (error) {
            console.log(error);
            res.status(517).json({message: error.message})
            
        }
    }
}
        
module.exports = campaignSynergy;
