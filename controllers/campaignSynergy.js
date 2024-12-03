require('dotenv').config
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
const pdf = require("html-pdf");


class campaignSynergy{
    static async getDatesSynergy(req,res){
                
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
        let data = [];
        let key = '';
        for(let i in reportData) {
            let options = {
                method: 'post',
                body: JSON.stringify({         
                    dates: ["2024-10-01","2024-10-31"],
                    seller_ids:req.body.coduser,
                    ...reportData[i]
                }),
            method:'post',
            headers:{
                Accept:"application/json",
                "Content-type":"application/json",
                Authorization: process.env.AUTH
            }
            };
            //console.log(reportData[i])
            const url = "http://192.168.2.151:3004/api/controllers/modules/reports/reportscontroller/getData"
            const response = await fetch(url, options);
            const responseJson = await response.json();
            const dataArray = responseJson.data[0];
            data = dataArray;
            //console.log(dataArray);
            //console.log(`Dados para ${i}`, responseJson, reportData[i]);
                for (i = 0; i < Object.keys(data).length; i++) {
                    key = Object.keys(data)[i];  // Ensure proper checks
                    console.log(dataArray)            
            

                contentLinesPillar.push(`
                    <tr>
                        <td><text class="content-center">${key}</text></td>
                        <td><text class="content-center">${data[key]}</text></td>
                        <td><text class="content-center"></text></td>
                    </tr>
                `);
                }
            };
            let content = 
                `
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

                    <!DOCTYPE html>
                    <html lang="en">
                    <head>
                        <meta charset="UTF-8">
                        <meta name="viewport" content="width=device-width, initial-scale=1.0">
                        <title>Document</title>
                    </head>
                    <body>
                        <table>
                            <h1 style="text-align: center;">Campanha Sinergia</h1>
                            <tr>
                                <td>
                                    <text class="content">
                                        ${RCA[key]}
                                    </text>
                                </td>
                                <td>
                                    <text class="content">
                                        ${data?.SUPERVISOR}
                                    </text>
                                </td>
                                <td>
                                    <text class="content">
                                        ${data?.RCA}
                                    </text>
                                </td>
                                <td>
                                    <text class="content">
                                        ${data?.CODRCA}
                                    </text>
                                </td>
                                <td>
                                    <text class="content">

                                    </text>
                                </td>
                            </tr>
                        </table>
                        <table>
                            <h2 style="text-align: center;">Criterio de participação</h2>
                            <tr>
                                <td colspan="3">
                                    <text class="content-center">
                                        Peso
                                    </text>
                                </td>
                                <td colspan="3">
                                    <text class="content-center">
                                        Valor
                                    </text>
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    <text class="content-center" >
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
                                        Falta
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
                                        Falta
                                    </text>
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    <text class="content-center">
                                        0
                                    </text>
                                </td>
                                <td>
                                    <text class="content-center">
                                        0
                                    </text>
                                </td>
                                <td>
                                    <text class="content-center">
                                        0
                                    </text>
                                </td>
                                <td>
                                    <text class="content-center">
                                        R$0,00
                                    </text>
                                </td>
                                <td>
                                    <text class="content-center">
                                        R$0,00
                                    </text>
                                </td>
                                <td>
                                    <text class="content-center">
                                        R$0,00
                                    </text>
                                </td>
                            </tr>
                        </table>
                        <table>
                            <tr>
                                <td class="notbordered">
                                    <text  class="content-center">
                                        &nbsp;
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
                }
            }
        
module.exports = campaignSynergy;
