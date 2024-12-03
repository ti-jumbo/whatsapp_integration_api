const DBConnectionMenager = require("../database/DBConnectionMenager");
const { QueryType, QueryTypes } = require("sequelize");
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
const pdf = require("html-pdf");

class currentAccountCampaign {

    

  static async getDate(req, res, next) {
    if( req.body.coduser && req.body.month != ""){ 
      let nameMonth = null;
      let month = null;
      if(req.body.month == '11'){
        nameMonth = "Novembro"
        month = ["2024-11-01", "2024-11-30"]
      }
      if(req.body.month == 12){
        nameMonth = "Dezembro"
        month = ["2024-12-01", "2024-12-31"]
      }
      // get date rca
      const getConnectionObj = await  DBConnectionMenager.getDefaultConnection().query(
        `
          SELECT 
            coduser,
            name,
            pillar,
            premiations,
            objective,
            months
          FROM 
          campaign_cc 
          WHERE 
          coduser = '${req.body.coduser}'
          and months = '${nameMonth}'`,
        
          {
            type: QueryTypes.SELECT
          }
      )
      console.log(getConnectionObj)
      try{
        const reportData = {
          CLIENTES: {
            counterClient:0,
            PREMIO:getConnectionObj[0].premiations,
            OBJETIVO:getConnectionObj[0].objective,
          },
          FROOTY: {
            counterClient:0,
            PREMIO:getConnectionObj[1].premiations,
            OBJETIVO:getConnectionObj[1].objective,
            conditions: [{
              reportVision: {
                id: 5
              },
              operation: {
                id: "IN"
              },
              selecteds: [{
                id: 500797
              }, {
                id: 501538
              }, {
                id: 501747
              }]
            }]
          },
          "BEM BRASIL": {
            counterClient:0,
            PREMIO:getConnectionObj[2].premiations,
            OBJETIVO:getConnectionObj[2].objective,
            conditions: [{
              reportVision: {
                id: 5
              },
              operation: {
                id: "IN"
              },
              selecteds: [{
                id: 500063
              }, {
                id: 501071
              }]
            }]
          },
          WILSON: {
            counterClient:0,
            PREMIO:getConnectionObj[3].premiations,
            OBJETIVO:getConnectionObj[3].objective,
            conditions: [{
              reportVision: {
                id: 5
              },
              operation: {
                id: "IN"
              },
              selecteds: [{
                id: 500041
              }, {
                id: 500483
              }]
            }]
          },
          "VALANDRO/CANTU": {
            counterClient:0,
            PREMIO:getConnectionObj[4].premiations,
            OBJETIVO:getConnectionObj[4].objective,
            conditions: [{
              reportVision: {
                id: 5
              },
              operation: {
                id: "IN"
              },
              selecteds: [{
                id: 503108
              }, {
                id: 503065
              }]
            }]
          },
          "AURORA/REZENDE": {
            counterClient:0,
            PREMIO:getConnectionObj[5].premiations,
            OBJETIVO:getConnectionObj[5].objective,
            conditions: [{
              reportVision: {
                id: 5
              },
              operation: {
                id: "IN"
              },
              selecteds: [{
                  id: 500157
                },
                {
                  id: 500158
                },
                {
                  id: 500159
                },
                {
                  id: 500161
                },
                {
                  id: 500162
                },
                {
                  id: 500199
                },
                {
                  id: 500201
                },
                {
                  id: 500202
                },
                {
                  id: 500204
                },
                {
                  id: 500205
                },
                {
                  id: 500206
                },
                {
                  id: 500207
                },
                {
                  id: 500208
                },
                {
                  id: 500209
                },
                {
                  id: 500474
                },
                {
                  id: 500603
                },
                {
                  id: 500632
                },
                {
                  id: 501492
                },
                {
                  id: 502968
                },
                {
                  id: 503016
                },
                {
                  id: 34092
                },
                {
                  id: 34100
                },
                {
                  id: 34133
                },
                {
                  id: 34134
                },
                {
                  id: 34139
                },
                {
                  id: 34140
                },
                {
                  id: 34141
                },
                {
                  id: 34142
                },
                {
                  id: 34143
                },
                {
                  id: 34144
                },
                {
                  id: 34145
                },
                {
                  id: 34146
                },
                {
                  id: 34154
                },
                {
                  id: 34155
                },
                {
                  id: 34156
                },
                {
                  id: 34157
                },
                {
                  id: 34158
                },
                {
                  id: 34159
                },
                {
                  id: 34163
                },
                {
                  id: 34164
                },
                {
                  id: 34165
                },
                {
                  id: 34175
                },
                {
                  id: 39999
                },
                {
                  id: 43425
                },
                {
                  id: 228659
                },
                {
                  id: 234868
                },
                {
                  id: 235269
                },
                {
                  id: 500195
                },
                {
                  id: 577855
                },
                {
                  id: 577871
                },
                {
                  id: 577944
                },
                {
                  id: 577952
                }
              ]
            }]
          }
        };
        for (let i in reportData) {
          let options = {
            method: 'post',
            body: JSON.stringify({
              visions: [4, 7, 8, 13],
              periods: [
                month
              ],
              viewWeight: true,
              considerNormalSales: true,
              considerReturns: true,
              ...reportData[i]
            }),
          headers: {
            Accept: "application/json",
            "Content-type": "application/json",
            Authorization: process.env.AUTH// Adicione sua chave de autorização aqui
          }
          };
          const url = "http://192.168.2.151:3004/api/controllers/modules/reports/reportscontroller/getcustomizedreportdata"
          const response = await fetch(url, options);
          const responseJson = await response.json();
          //console.log(`Dados para ${i}`, responseJson);
          const dataArray = responseJson.data[0].DATA;
          const filteredData = dataArray.filter(item => item.CODRCA == req.body.coduser)
          //console.log(filteredData)
          if(filteredData.length > 0){
            let objectkeys = Object.keys(filteredData[0])
            let colvalname = objectkeys[objectkeys.length - 1]
            for (let j = 0; j < filteredData.length; j++) {
              if (filteredData[j][colvalname] > 0) {
                reportData[i].counterClient++;
              }
            }
          }else{
            console.log("Nenhum dado encontrado");
          }
            
        };
        let totalPremiacao = 0;
        let contentLines = [];
        for(let i in reportData){
          totalPremiacao += reportData[i].counterClient >= reportData[i].OBJETIVO ? reportData[i].PREMIO : 0;
          contentLines.push(
            `
            <tr>
            <td>${i}</td>
            <td>$ ${reportData[i].PREMIO}</td>
            <td>${reportData[i].OBJETIVO}</td>
            <td>${reportData[i].counterClient}</td>
            <td>$ ${reportData[i].counterClient >= reportData[i].OBJETIVO ? reportData[i].PREMIO : 0}</td>
            </tr>
            `  
          );
        } 
        let content =`
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
        </style>
        <!DOCTYPE html>
        <html lang="en">
          <head>
              <meta charset="UTF-8">
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
              <title>Conta corrente</title>
          </head>
          <body>
              <h1  style="text-align: center;">Conta corrente</h1>
              <h2 style="text-align: center;">${req.body.coduser}</h2>
              <h3 style="text-align: center;"></h3>
              <table>
                <thead>
                    <tr>
                      <th>
                          <text class="content">
                            ITEM CAMPANHA
                          </text>
                      </th>
                      <th>
                          <text class="content">
                            PREMIO
                          </text>
                      </th>
                      <th>
                          <text class="content">
                            OBJETIVO
                          </text>
                      </th>
                      <th>
                          <text class="content">
                            REALIZADO
                          </text>
                      </th>
                      <th>
                          <text class="content">
                            VALOR A RECEBER
                          </text>
                      </th>
                    </tr>
                </thead>
                <tbody>
                    ${contentLines.join("")}
                </tbody>
                <tfoot>
                    <tr>
                      <td>
                          <text class="content">
                            TOTAL PREMIAÇÃO
                          </text>
                      </td>
                      <td colspan="4">
                          <text class="content" style="text-align: center;">
                            $ ${totalPremiacao}
                          </text>
                      </td>
                    </tr>
                </tfoot>
              </table>
          </body>
        </html>
        `;
        pdf.create(content, {
        }).toFile("./CurrentAccountCampaign.pdf",(err,res) => {
            if(err){
                console.log('erro :(');
            }else{
                console.log(res);
              }
          })

      }catch{
        res.status(517).json("failled")
      }
    }else{
      res.status(401).json("notfound Information Body")
    }
  }
}

module.exports = currentAccountCampaign;