require('dotenv').config
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
const pdf = require("html-pdf");

class campaignSynergy2025{

    static async campaignSynergy2025(req,res){
        try {
            console.log('aq')
            const reportData= {
                CRITPART:{REPORTID:44},
                RATINGS:{REPORTID:45},
                DEVOLUCOES:{REPORTID:46}
            };
            let month = req.body.month;
            let monthSelection;
                if(month != null && month != ' ' && month != '') {
                    if(month == '1'){
                        monthSelection = ["2025-01-01","2025-01-31"]
                    }
                    if(month == '2'){
                        monthSelection = ["2025-02-01","2025-02-29"]
                    }
                    if(month == '3'){
                        monthSelection = ["2025-03-01","2025-03-31"]
                    }
                    if(month == '4'){
                        monthSelection = ["2025-04-01","2025-04-30"]
                    }
                    if(month == '5'){
                        monthSelection = ["2025-05-01","2025-05-31"]
                    }
                    if(month == '6'){
                        monthSelection = ["2025-06-01","2025-06-30"]
                    }
                    if(month == '7'){
                        monthSelection = ["2025-07-01","2025-07-31"]
                    }
                    if(month == '8'){
                        monthSelection = ["2025-08-01","2025-08-31"]
                    }
                    if(month == '9'){
                        monthSelection = ["2025-09-01","2025-09-30"]
                    }
                    if(month == '10'){
                        monthSelection = ["2025-10-01","2025-10-31"]
                    }
                    if(month == '11'){
                        monthSelection = ["2025-05-01","2025-11-30"]
                    }
                    if(month == '12'){
                        monthSelection = ["2025-12-01","2025-12-31"]
                    }
                }

            let contentLinesPillar = [];
            let contentLinesInf = [];
            let contentLinesdates = [];
            let contentLinesDevolution = [];
            let premiationPillar= 0;
            let participa = "";
            

            console.log(reportData);
            let RestantePeso = 0;
            let RestanteValor = 0;
            for(let i in reportData) {
                console.log('aqui2' , reportData)
                let options = {
                    method: 'post',
                    body: JSON.stringify ({
                        dates:monthSelection,
                        sellers_ids:req.body.coduser,
                        ...reportData[i]
                    }),
                    headers:{
                        Accept:"application/json",
                        "Content-Type":"application/json",
                        Authorization:process.env.AUTH
                    },
                    
                };
                console.log(options)
                const url = "http://192.168.2.151:3004/api/controllers/modules/reports/reportscontroller/get_data"
                const response = await fetch(url, options);
                const responseJson = await response.json();

                switch (reportData[i].REPORTID) {
                    
                    case 44:
                        contentLinesInf.push(`
                            <tr>
                                <td><text>Nome: ${responseJson.data[0][`RCA`]}</text></td>
                                <td><text>CODRCA: ${responseJson.data[0][`CODRCA`]}</text></td>
                                <td><text>SUPERVISOR: ${responseJson.data[0][`SUPERVISOR`]}</text></td>
                                <td><text>MES: ${responseJson.data[0][`MES`]}</text></td>                         
                            </tr>
                            `)

                             RestantePeso = responseJson.data[0][`'p1'_PESO`] - responseJson.data[0][`'p2'_PESO`]
                             RestanteValor = responseJson.data[0][`'p1'_VALOR`] - responseJson.data[0][`'p2'_VALOR`]
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
                        case 46:
                            let Devolution = (responseJson.data[0]["'p1d'_VALOR"] /responseJson.data[0]["'p1'_VALOR"] *-1) * 100 
                            participa =RestanteValor <= 0 && RestantePeso <= 0 && Devolution < 1 ? 'ESTÁ PARTICIPANDO' : 'NÃO ESTÁ PARTICIPANDO'
                            contentLinesDevolution.push(`
                                <tr>
                                    <td style="text-align: center; color: ${Devolution <= 1 ? 'green' : 'brown'};">
                                        ${Devolution.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}%
                                    </td>
                                </tr>
                                <tr>
                                    <td style="text-align: center; color: ${RestanteValor <= 0 && RestantePeso <= 0 && Devolution < 1 ? 'green' : 'brown'};">
                                        ${participa}
                                    </td>
                                </tr>
                                `);
                        break;
                        case 45:
                            console.log('xxxxxxxxxx ',responseJson.data[0])
                            for (let d in  responseJson.data[0]){
                                  // Ensure proper checks
                                let pillarName = null;  
                                
                                if(d.indexOf('M_') === 0 && d != 'M_PESO'){
                                    pillarName = d.substring(2)
                                    let P_pillar = responseJson.data[0][`P_${pillarName}`]
                                    premiationPillar += P_pillar
                                    
                                    contentLinesPillar.push(`
                                        <tr>
                                            <td><text class="content-center">${pillarName}</text></td>
                                            <td><text class="content-center">${responseJson.data[0][d].toLocaleString('pt-BR', {  maximumFractionDigits:2})}</text></td>
                                            <td><text class="content-center">${responseJson.data[0][`V_${pillarName}`]}</text></td>
                                            <td><text class="content-center" style=color:${P_pillar == 1 ? "green" : "darkgoldenrod"}>${P_pillar}</text></td>
                                        </tr>
                                    `);
                                }
                            };
                            console.log("PILARRRRRR",premiationPillar)
                        break;
                    default:
                        console.log("KCT MESMO")
                        break;
                }
            };
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
                                                Objetivo
                                            </text>
                                        </td>
                                        <td>
                                            <text class="content-center">
                                                Realizado
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
                                        <td colspan="2"  style="text-align:center">
                                            <text >
                                                Devolução
                                            </text>
                                        </td>
                                        ${contentLinesDevolution.join("")}

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
                                                Objetivo
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
                                    <tr>
                                        <td colspan="3">
                                            <text>
                                                Valor a receber:
                                            </text>
                                        </td>
                                        <td style="text-align: center;">
                                            <text >
                                                R$${participa == "ESTÁ PARTICIPANDO" ? premiationPillar * 80 : 0}
                                            </text>
                                        </td>
                                    </tr>
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
           
           res.status(517).json({message: error.message})
           console.log('errrouuuuu') 
        }
    }
}
module.exports = campaignSynergy2025;