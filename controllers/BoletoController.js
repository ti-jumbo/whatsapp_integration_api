const DBConnectionMenager = require("../database/DBConnectionMenager");
const { QueryTypes } = require("sequelize");
const pdf = require('html-pdf');
const logoSicredi = require('./logoSicredi.js')

class BoletoController{
    
        static encodingMap = {
            '0': 'nnwwn',
            '1': 'wnnnw',
            '2': 'nwnnw',
            '3': 'wwnnn',
            '4': 'nnwnw',
            '5': 'wnwnn',
            '6': 'nwwnn',
            '7': 'nnnww',
            '8': 'wnnwn',
            '9': 'nwnwn'
        };

        static teste_scop = 44;


        static createBar(size, color, height) {
            let style=`display: inline-block;height: ${height}px;margin: 0;width:${size};background-color:${color}`
            const bar = `<div style="${style}"></div>`;
            return bar;
        }
        

        static barCodeCreate(lineCode, wideBarSize, height) {
            let result = [];
            
    
            
            // Se o número for ímpar, adicionar '0' à esquerda
            if (lineCode.length % 2 !== 0) {
                lineCode = '0' + lineCode;
            }
            wideBarSize = wideBarSize || 6;
            height = height || 100;

            let smallBar = `${ wideBarSize / 3 }px`;

            result.push(BoletoController.createBar(smallBar,"black",height));
            result.push(BoletoController.createBar(smallBar,"white",height));
            result.push(BoletoController.createBar(smallBar,"black",height));
            result.push(BoletoController.createBar(smallBar,"white",height));


            // Codificar cada par de dígitos
            for (let i = 0; i < lineCode.length; i += 2) {
                const firstDigit = BoletoController.encodingMap[lineCode[i]];
                const secondDigit = BoletoController.encodingMap[lineCode[i + 1]];

                // Codificação intercalada: barras para o primeiro dígito, espaços para o segundo
                for (let j = 0; j < 5; j++) {
                    if (firstDigit[j] === 'n') {
                        result.push(BoletoController.createBar(smallBar,"black",height));
                    } else {
                        result.push(BoletoController.createBar(wideBarSize,"black",height));
                    }

                    if (secondDigit[j] === 'n') {
                        result.push(BoletoController.createBar(smallBar,"white",height));
                    } else {
                        result.push(BoletoController.createBar(wideBarSize,"white",height));
                    }
                }
            }


            // Adicionar o padrão de término
            result.push(BoletoController.createBar(wideBarSize,"black",height));
            result.push(BoletoController.createBar(smallBar,"white",height));
            result.push(BoletoController.createBar(smallBar,"black",height));

            return result.join('');
            
            
        }
        
    
        static async getBillInfo(req) {
            try{
                let query=`
                SELECT
                    PP.CODFILIAL,
                    PP.NOSSONUMBCO,
                    PP.CODCLI,
                    PP.PREST,
                    PP.DUPLIC,
                    PP.VALOR,
                    PP.DTVENC,
                    PP.DTEMISSAO,
                    PP.DTSAIDA,
                    PP.LINHADIG,
                    PP.CODBARRA,
                    PP.VALORORIG,
                    PC.CLIENTE,
                    PC.ENDERCOB,
                    PC.MUNICCOB,
                    PC.ESTENT,
                    PC.CEPENT,
                    PC.CGCENT,
                    ROUND ((NVL(PP.VALOR,0) + NVL(PP.TXPERMPREVISTO,0)) *
                    CASE NVL(PCCOB.CALCJUROSCOBRANCA, 'N') WHEN 'S' THEN 
                            NVL(PCCOB.TXJUROS, 0) 
                        ELSE NVL(PCCONSUM.PERCJUROSMORA, 0) END / 100 / 30 ,2) calcJurosDiario
                FROM
                
                    PCPREST PP
                    LEFT OUTER JOIN PCCLIENT PC ON (
                        PP.CODCLI = PC.CODCLI
                    )
                    LEFT OUTER JOIN PCCOB ON(
                        PCCOB.CODCOB = PP.CODCOB    
                    )
                    LEFT OUTER JOIN PCCONSUM ON (
                        1 = 1
                    )
                WHERE
                    PP.codFILIAL = ${req.body.CODFILIAL}
                    and PP.duplic = ${req.body.DUPLIC}
                    and PP.PREST = ${req.body.PREST}
                    and PP.CODCLI = ${req.loggedUser.user_winthor_id}
                `;
            
                const billInfo = await DBConnectionMenager.getWhintorConnection().query( query,
                    {
                        type: QueryTypes.SELECT
                    }
                )
                
                if(billInfo.length > 0) {
                return billInfo[0];
                
                }
            }catch(e){
                    console.log(e)
                    res.status(500).json()
                }
            
            }

            static async getBillPdf(req, res){
                try{
                    let billInfo = await BoletoController.getBillInfo(req);
                    console.log(billInfo)
                    let barCode = BoletoController.barCodeCreate(billInfo.CODBARRA, 4 , 60);
                    let content = ` 
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
                                padding-right: 10px; 
                                padding-left: 5px;

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

                        <table>
                        <tbody>
                            <tr>
                                <td colspan="10" style="text-align:center;">
                                    INFORMATIVO
                                </td>
                            </tr>
                            <tr style="height: 7cm;">
                                <td colspan="10">
                            
                                </td>
                            </tr>
                            <tr style="height: 1.4cm;">
                                <td class="notbordered">
                                </td>
                            </tr>
                            <tr style="height: 0.6cm;">
                                <td class="notbordered first container" >
                                <img src="${logoSicredi}" />
                                </td>
                                <td colspan="2" style="font-size: 28; vertical-align:middle; border-top:none">
                                    748-X
                                </td>
                                <td colspan="7" style="text-align: right; vertical-align:middle;" class="notbordered">
                                    <text class="content" style="font-size: 22">
                                    Recibo do Pagador
                                    </text>
                                </td>
                            </tr>
                            <tr>
                                <td colspan="9" >
                                    <text class="header">
                                    Local do pagamento
                                    </text>
                                    <text class="content">
                                    PAGAVEL PREFERENCIALMENTE NA COOP. DE CREDITO DA SICREDI
                                    </text>
                                </td>
                                <td class="last">
                                    <text class="header">
                                    VENCIMENTO
                                    </text>
                                    <text class="content">
                                    ${billInfo.DTVENC.toLocaleString().substring(0,10)}
                                    </text>
                                </td>
                            </tr>
                            <tr>
                                <td colspan="9">
                                    <text class="header">
                                    Beneficiario
                                    </text>
                                    <text class="content">
                                    JUMBO ALIMENTOS LTDA &nbsp&nbsp 85.522.043/0001-90
                                    </text>
                                </td>
                                <td class="last">
                                    <text class="header">
                                    AGENCIA/CODIGO DO BENEFICIARIO
                                    </text>
                                    <text class="content">
                                    0710 / 39 / 90460
                                    </text>
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    <text class="header">
                                    Data do Documento
                                    </text>
                                    <text class="content">
                                    ${billInfo.DTEMISSAO.toLocaleString().substring(0,10)}
                                    </text>
                                </td>
                                <td colspan="3">
                                    <text class="header">
                                    n° do Documento
                                    </text>
                                    <text class="content">
                                    ${billInfo.DUPLIC}-${billInfo.PREST}
                                    </text>
                                </td>
                                <td>
                                    <text class="header">
                                    especie doc
                                    </text>
                                    <text class="content">
                                    Outros
                                    </text>
                                </td>
                                <td>
                                    <text class="header">
                                    Aceite
                                    </text>
                                    <text class="content">
                                    N
                                    </text>
                                </td>
                                <td colspan="3" style="width: 1cm;">
                                    <text class = "header">
                                    Data Processamento
                                    </text>
                                    <text class="content">
                                    ${billInfo.DTEMISSAO.toLocaleString().substring(0,10)}
                                    </text>
                                </td>
                                <td class="last">
                                    <text class="header">
                                    Nosso numero
                                    </text>
                                    <text class="content">
                                    ${billInfo.NOSSONUMBCO}
                                    </text>
                                </td>
                            </tr>
                            <tr>
                                <td colspan="2">
                                    <text class="header">

                                    </text>
                                    <text class="content">

                                    </text>
                                </td>
                                <td>
                                    <text class="header">
                                    espécie
                                    </text>
                                    <text class="content">
                                    Real
                                    </text>
                                </td>
                                <td colspan="3">
                                    <text class="header">
                                    Quantidade
                                    </text>
                                    <text class="content">
                                    &nbsp;
                                    </text>
                                </td>
                                <td colspan="3">
                                    <text class="header">
                                    Valor
                                    </text>
                                    <text class="content">
                                    ${billInfo.VALOR.toLocaleString('pt-BR',{  
                                        minimumFractionDigits: 2,
                                        maximumFractionDigits: 2,
                                    })}
                                    </text>
                                </td>
                                <td class="last">
                                    <text class="header">
                                    Valor documento
                                    </text>
                                    <text class="content">
                                    ${billInfo.VALORORIG.toLocaleString('pt-BR',{  
                                        minimumFractionDigits: 2,
                                        maximumFractionDigits: 2,
                                    })}
                                    </text>
                                </td>
                            </tr>
                            <tr>
                                <td colspan="9" rowspan="5" >
                                    <text class="header">
                                    Instruções
                                    </text>
                                    <text class="content">
                                    COBRAR MORA DIARIA DE R$ ${billInfo.CALCJUROSDIARIO}
                                    </text>
                                    <text class="content">
                                    APOS O VENCIMENTO SUJEITO A PROTESTO 
                                    </text>
                                </td>
                                <td class="last">
                                    <text class="header">
                                    (-)Descontos/ Abatimentos 0,00
                                    </text>
                                    <text class="content">
                                    0,00
                                    </text>
                                </td>
                            </tr>
                            <tr>
                                <td class="last">
                                    <text class="header">
                                    (-)Outras deduções
                                    </text>
                                    <text class="content">
                                    &nbsp;
                                    </text >
                                </td>
                            </tr>
                            <tr>
                                <td class="last" style="height: 1cm;">
                                    <text class="header">
                                    (-)Mora / Multa
                                    </text>
                                    <text class ="content">
                                    &nbsp;
                                    </text>
                                </td>
                            </tr>
                            <tr>
                                <td class="last">
                                    <text class="header">
                                    (+) Outros Acréscimos
                                    </text>
                                    <text class ="content">
                                    &nbsp;
                                    </text>
                                </td>
                            </tr>
                            <tr>
                                <td class="last">
                                    <text class="header">
                                    (=) Valor Cobrado
                                    </text>
                                    <text class ="content">
                                    &nbsp;
                                    </text >
                                </td>
                            </tr>
                            <tr>
                                <td colspan="10" >
                                    <text class="header">
                                    pagador
                                    </text>
                                    <text class="content">
                                    ${billInfo.CLIENTE} &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;${billInfo.CGCENT}
                                    </text>
                                    <text class="content">
                                    ${billInfo.ENDERCOB} &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; CEP: ${billInfo.CEPENT}
                                    </text>
                                    <text class="content">
                                    ${billInfo.MUNICCOB} &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; ${billInfo.ESTENT}
                                    </text>
                                    <text class="header">
                                    sacador avalista &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Código da Baixa:
                                    </text>
                                </td>
                            </tr>
                            <tr>
                                <td  colspan="8" class="notbordered last" >
                                    <text class="header">recebimento através do choque N°</text>
                                    <text class="header">Do Banco</text>
                                    <text class="header">Esta quitação só terá validade após pagamentos de cheque pelo banco pagador</text>
                                    <text class="header">Até o vencimento pagável em qualquer agencia bancária</text>     
                                </td>
                                <td colspan="2" class="notbordered">
                                    <text class="header">-------------------AUTENTICAÇÃO MECANICA--------------------</text>
                                
                                </td>
                            </tr>
                            <tr>
                                <td  colspan="10" class="notbordered">
                                    <text class="after">
                                    - - - - - - - - - - - - - - - - - - - - - -  - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 
                                    </text>
                                </td>
                            </tr>
                            <tr style="height: 0.6cm;">
                                <td   class="notbordered first container">
                            <img src= "${logoSicredi}" />
                                </td>
                                <td colspan="2" style="font-size: 28; vertical-align:middle; border-top:none">
                                    748-X
                                </td>
                                <td colspan="7" style="text-align: right; vertical-align:middle;" class="notbordered">
                                    <text class="content" style="font-size: 22;">
                                    ${billInfo.LINHADIG}
                                    </text>
                                </td>
                            </tr>
                            <tr>
                                <td colspan="9" >
                                    <text class="header">
                                    Local do pagamento
                                    </text>
                                    <text class="content">
                                    PAGAVEL PREFERENCIALMENTE NA COOP. DE CREDITO DA SICREDI
                                    </text>
                                </td>
                                <td class="last">
                                    <text class="header">
                                    VENCIMENTO
                                    </text>
                                    <text class="content">
                                    ${billInfo.DTVENC.toLocaleString().substring(0,10)}
                                    </text>
                                </td>
                            </tr>
                            <tr>
                                <td colspan="9">
                                    <text class="header">
                                    Beneficiario
                                    </text>
                                    <text class="content">
                                    JUMBO ALIMENTOS LTDA &nbsp&nbsp 85.522.043/0001-90
                                    </text>
                                </td>
                                <td class="last">
                                    <text class="header">
                                    AGENCIA/CODIGO DO BENEFICIARIO
                                    </text>
                                    <text class="content">
                                    0710 / 39 / 90460
                                    </text>
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    <text class="header">
                                    Data do Documento
                                    </text>
                                    <text class="content">
                                    
                                    ${billInfo.DTEMISSAO.toLocaleString().substring(0,10)}
                                    </text>
                                </td>
                                <td colspan="3">
                                    <text class="header">
                                    n° do Documento
                                    </text>
                                    <text class="content">
                                    ${billInfo.DUPLIC}-${billInfo.PREST}
                                    </text>
                                </td>
                                <td>
                                    <text class="header">
                                    especie doc
                                    </text>
                                    <text class="content">
                                    Outros
                                    </text>
                                </td>
                                <td>
                                    <text class="header">
                                    Aceite
                                    </text>
                                    <text class="content">
                                    N
                                    </text>
                                </td>
                                <td colspan="3">
                                    <text class = "header">
                                    Data Processamento
                                    </text>
                                    <text class="content">
                                    ${billInfo.DTEMISSAO.toLocaleString().substring(0,10)}
                                    </text>
                                </td>
                                <td class="last">
                                    <text class="header">
                                    Nosso numero
                                    </text>
                                    <text class="content">
                                    ${billInfo.NOSSONUMBCO}
                                    </text>
                                </td>
                            </tr>
                            <tr>
                                <td colspan="2">
                                    <text class="header">

                                    </text>
                                    <text class="content">

                                    </text>
                                </td>
                                <td>
                                    <text class="header">
                                    espécie
                                    </text>
                                    <text class="content">
                                    Real
                                    </text>
                                </td>
                                <td colspan="3">
                                    <text class="header">
                                    Quantidade
                                    </text>
                                    <text class="content">
                                    &nbsp;
                                    </text>
                                </td>
                                <td colspan="3" >
                                    <text class="header">
                                    Valor
                                    </text>
                                    <text class="content">
                                    ${billInfo.VALOR.toLocaleString('pt-BR',{  
                                        minimumFractionDigits: 2,
                                        maximumFractionDigits: 2,
                                    })}
                                    </text>
                                </td>
                                <td class="last">
                                    <text class="header">
                                    Valor documento
                                    </text>
                                    <text class="content">
                                    ${billInfo.VALOR.toLocaleString('pt-BR',{  
                                        minimumFractionDigits: 2,
                                        maximumFractionDigits: 2,
                                    })}
                                    </text>
                                </td>
                            </tr>
                            <tr>
                                <td colspan="9" rowspan="5" >
                                    <text class="header">
                                    Instruções
                                    </text>
                                    <text class="content">
                                    COBRAR MORA DIARIA DE R$ ${billInfo.CALCJUROSDIARIO}
                                    </text>
                                    <text class="content">
                                    APOS O VENCIMENTO SUJEITO A PROTESTO 
                                    </text>
                                </td>
                                <td class="last">
                                    <text class="header">
                                    (-)Descontos/ Abatimentos 0,00
                                    </text>
                                    <text class="content">
                                    0,00
                                    </text>
                                </td>
                            </tr>
                            <tr>
                                <td class="last">
                                    <text class="header">
                                    (-)Outras deduções
                                    </text>
                                    <text class="content">
                                    &nbsp;
                                    </text >
                                </td>
                            </tr>
                            <tr>
                                <td class="last" style="height: 1cm;">
                                    <text class="header">
                                    (-)Mora / Multa
                                    </text>
                                    <text class ="content">
                                    &nbsp;
                                    </text>
                                </td>
                            </tr>
                            <tr>
                                <td class="last">
                                    <text class="header">
                                    (+) Outros Acréscimos
                                    </text>
                                    <text class ="content">
                                    &nbsp;
                                    </text>
                                </td>
                            </tr>
                            <tr>
                                <td class="last">
                                    <text class="header">
                                    (=) Valor Cobrado
                                    </text>
                                    <text class ="content">
                                    &nbsp;
                                    </text >
                                </td>
                            </tr>
                            <tr>
                                <td colspan="10" >
                                    <text class="header">
                                    pagador
                                    </text>
                                    <text class="content">
                                    ${billInfo.CLIENTE} &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;${billInfo.CGCENT}
                                    </text>
                                    <text class="content">
                                    ${billInfo.ENDERCOB} &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; CEP: ${billInfo.CEPENT}
                                    </text>
                                    <text class="content">
                                    ${billInfo.MUNICCOB} &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; ${billInfo.ESTENT}
                                    </text>
                                    <text class="header">
                                    sacador avalista &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Código da Baixa:
                                    </text>
                                </td>
                            </tr>
                            <tr>
                                <td colspan="8" class="notbordered">
                                    <div>
                                    ${barCode}
                                    </div>
                                </td>
                                <td colspan="2" class="notbordered last">
                                    <text class="header">
                                    -------------------AUTENTICAÇÃO MECANICA--------------------
                                    <text>
                                    <text style="font-size: 18;" class="content">Ficha de compensação</text>
                                </td>
                            </tr>
                        </tbody>
                
                        </table>`;
                    pdf.create(content,{
                    }).toFile("./jumboalimentos.pdf",(err,res) => {
                        if(err){
                            console.log('erro :(');
                        }else{
                            console.log(res);
                        }
                        
                    })
                res.status(200).send(content)
            }catch(e){
                console.log(e)
                res.status(500).json()
            }
                }
                
            }
    
    







       
module.exports = BoletoController;