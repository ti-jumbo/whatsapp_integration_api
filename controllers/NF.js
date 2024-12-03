const pdf = require('html-pdf');


//NF Feita, suporta até 25 produtos porém vamos colocar como maximo de 20 produtos e quebrar a pagina

class nf_controller{
   
    static async NF(req, res, next) {
        
        let products = []
            for(let i = 0; i<15; i++){
                products.push(
                    `
                    <tr>
                    <td>
                    <text  class="content">
                        2725
                    </text>
                    </td>
                    <td>
                    <text class="content">
                        QUEIJO MUSSARELA AURORA BARRA 4X4,1 KG
                    </text>
                    </td>
                    <td>
                    <text class="content">
                        04061010
                    </text>
                    </td>
                    <td>
                    <text class="content">
                        020
                    </text>
                    </td>
                    <td>
                    <text class="content">
                        5102
                    </text>
                    </td>
                    <td>
                    <text class="content">
                        KG
                    </text>
                    </td>
                    <td>
                    <text class="content">
                        82
                    </text>
                    </td>
                    <td>
                    <text class="content">
                        35,90
                    </text>
                    </td>
                    <td>
                    <text class="content">
                        2.943,80
                    </text>
                    </td>
                    <td>
                    <text class="content">
                        1.056,53
                    </text>
                    </td>
                    <td>
                    <text class="content">
                        206,02
                    </text>
                    </td>
                    <td>
                    <text class="content">
                        19,50
                    </text>
                    </td>
                    <td>
                    0,00
                    </td>
                </tr>`
                )
            };
    
        let style=
        `
        <style>
        table {
            width: calc(100% - 2cm);
            border-collapse: collapse;
            margin-left: 1cm;
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
            border: none !important;
            
        }

        td text.header {
            display: block;
            font-size: 8;
            
        }
        td text.header2 {
            display: block;
            font-size: 10;
            
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
        .page-break {
        page-break-before: always;
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
        max-height:3cm;
        
        }
        </style>`;
        let cabecalho =
        `
        <table>
        <tbody>
        <tr>
            <td colspan="9" style="font-size: 12">
                <text class="content"> 
                RECEBEMOS DE JUMBO ALIMENTOS LTDA
                </text>
                <text class="content">
                OS PRODUTOS CONSTANTES DA NOTA FISCAL INDICADO AO LADO
                </text> 
            </td>
                <td colspan="1" class="last" rowspan="2">
                <text class="content" style="text-align: center;">
                    NF-e
                </text>
                <text class="content"  style="text-align: left;">
        
                    n°. 1231529
                </text>
                <text class="content" style="text-align: left;">
                    SÉRIE 1
                </text>
                </td>
            </tr>
            <tr>
            <td colspan="1" class="right">
                <text class="header">
                DATA DE PROCESSAMENTO
                </text>
                <text class="content">
                &nbsp;
                </text>
            </td>
            <td>
                <text class="header">
                IDENTIFICAÇÃO E ASSINATURA DO RECEBEDOR
                </text>
                <text class="content">
                &nbsp;
                </text>
            </td>
        </tr>
        </tbody>
        </table>

        <table>
        <tbody>
            <tr>
                <td colspan="2" style="border-right: none;" class=" first container" rowspan="3">
                <img src="data:image/png;base64,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"
        alt="logoJumbo" srcset="">
                </td>
                <td " rowspan="3" colspan="2">
                <text class="header2">
                    Identificação do Emitente
                </text>
                <text class="header2">
                    JUMBO ALIMENTOS LTDA
                </text>
                <text class="header2">
                    R ITATIBA DO SUL - 181 - ITAPEMA -
                </text>
                <text class="header2">
                    CASCAVEL - PR - 85504700
                </text>
                <text class="header2">
                    Telefone: 4532283232
                </text>
                <text class="header2">
                    Fax:
                </text>
                <text class="header2">
                    E-mail:
                </text>
                </td>
                <td colspan="1" rowspan="3" style="border-top:none;">
                <text  class="content" style="font-size: 20; text-align: center;">
                    DANF-e
                </text>
                <text class="header2" style="text-align: center;">
                    Documento Auxiliar de nota Fiscal
                </text>
                <text class="header2">
                    0 - ENTRADA
                </text>
                <text class="header2">
                    1 - SAIDA
                </text>
                <text class="header2">
                    N°. 1231529
                </text>
                <text class="header2">
                    SÉRIE 1 
                </text>
                </td>
                <td colspan="3"  style="height: 1.5cm;">
                <text class="content">
                    &nbsp;
                </text>
                </td>
            </tr>
            <tr>
                <td colspan="3" >
                <text class="header" >
                    CHAVE DE ACESSO
                </text>
                <text class="content" style="text-align: left;">
                    4124 1085 5220 4300 0190 5500 1001 2315 2911 6189 1872
                </text>
                </td>
                </tr>
                <tr>
                <td colspan="3" >
                <text class="content" style="text-align: center;">
                    Consulta de autendicidade no portal nacional da NF-e
                </text>
                <text class="content"  style="text-align: center;">

                    www.nfe.fazenda.gov.br/portal
                </text>
                </td>
            </tr>
        </tbody>
        </table>
        <table>
        <tbody>
            <tr >
                <td colspan="3" >
                <text class="header">
                    NATUREZA DE OPERAÇÃO
                </text>
                <text class="content">
                    VENDA DE MERC. ADQUIRIDA OU RECEBIDA DE TERCEIROS
                </text>
                </td>
                <td>
                <text colspan="2" class="header">
                    Protocolo de Autorização(Data e Hora)
                </text>
                <text>
                    141240317593887 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 17/10/2024 17:22:28
                </text>
                </td>
            </tr>
            <tr>
                <td>
                <text class="header">
                    INSCRIÇÃO ESTADUAL
                </text>
                <text class="content">
                    4101289341
                </text>
                </td>
                <td colspan="2">
                <text class="header">
                    INSC.EST.DO.SUBST.TRIBUTARIO
                </text>
                <text class="content">  
                    &nbsp;
                </text>
                </td>
                <td>
                    <text class="header">
                        CNPJ
                    </text>
                    <text>
                        85522043000190
                    </text>
                </td>
            </tr>
        </tbody>
        </table>
        
        <table>
        <tbody>
            <td class="notbordered">
                <text class="content" >
                DESTINÁTARIO/REMETENTE
                </text>
            </td>
            <tr>
                <td colspan="2">
                <text  class="header">
                    NOME/RAZÃO SOCIAL
                </text>
                    <text class="content">
                        V.MULLER & CIA LTDA
                    </text>
                </td>
                <td colspan="2">
                <text class="header">
                    CNPJ/CPF
                </text>
                <text class="content">
                    78.748.910/0001-44
                </text>
                </td>
                <td  colspan="2" >
                <text class="header">
                    DATA DA EMISSÃO
                </text>
                <text  class="content">
                    17/10/2024
                </text>
                </td>
            </tr> 
            <tr>
                <td colspan="3">
                <text class="header">
                    ENDEREÇO
                </text>
                <text class="content">
                    R JOSE CALDART                  ,  123          ND
                </text>
                </td>
                <td>
                <text class="header">
                    BAIRRO/DISTRITO
                </text>
                <text class="content">
                    MARIA LUIZA
                </text>
                </td>
                <td>
                <text class="header">
                    CEP
                </text>
                <text class="content">
                    85819570
                </text>
                </td>
                <td>
                <text class="header">
                    DATA DA ENTRADA/SAÍDA
                </text>
                <text class="content">
                    18/10/2024
                </text>
                </td>
            </tr>
            <tr>
                <td colspan="2">
                <text class="header">
                    MUNICIPIO
                </text>
                <text class="content">
                    CASCAVEL
                </text>
                </td>
                <td>
                <text class="header">
                    FONE/FAX
                </text>
                <text class="content">
                    4532245783
                </text>
                </td>
                <td>
                <text class="header">
                UF
                </text>
                <text class="content">
                PR
                </text>
                </td>
                <td>
                <text class="header">
                    INSCRIÇÃO ESTADUAL
                </text>
                <text class="content">
                    410002846
                </text>
                </td>
                <td>
                <text class="header">
                    HORA DA SAÍDA
                </text>
                <text class="content">
                    17:22
                </text>
                </td>
            </tr>
        </tbody>
        </table>

        <table>
        <tbody>
            <td class="notbordered">
                <text class="content">
                FATURA
                </text>
            </td>
            <tr>
                <td >
                <text class="header">
                    n°
                </text>
                <text class="content">
                    1
                </text>
                </td>
                <td>
                <text class="header">
                    Vencimento
                </text>
                <text class="content">
                    01/11/2024
                </text>
                </td>
                <td>
                <text class="header">
                    Valor
                </text>
                <text class="content">
                    2.943,80
                </text>
                </td>
            </tr>
        </tbody>
        </table>

        <table>
        <tbody>
            <td class="notbordered">
                CÁLCULO DE IMPOSTO
            </td>
            <tr>
                <td colspan="1">
                <text class="header">
                    BASE DE CÁLCULO DE ICMS
                </text>
                <text class="content">
                    1.056,53
                </text>
                </td>
                <td colspan="2">
                <text class="header">
                    VALOR DO ICMS
                </text>
                <text class="content">
                    206,02
                </text>
                </td>
                <td>
                <text class="header">
                    BASE DE CALCULO DO ICMS ST.
                </text>
                <text class="content">
                    0,00
                </text>
                </td>
                <td>
                <text class="header">
                    VALOR DO ICMS SUBSTITUIÇÃO
                </text>
                <text class="content">
                    0,00
                </text>
                </td>
                <td>
                <text class="header">
                    VALOR TOTAL DOS PRODUTOS
                </text>
                <text class="content">
                    2.943,80
                </text>
                </td>
            </tr>
            <tr>
                <td>
                <text class="header">
                    VALOR DO FRETE
                </text>
                <text class="content">
                    0,00
                </text>
                </td>
                <td>
                <text class="header">
                    VALOR DO SEGURO
                </text>
                <text class="content">
                    0,00
                </text>
                </td>
                <td>
                <text class="header">
                    VALOR DO DESCONTO
                </text>
                <text class="content">
                    0,00
                </text>
                </td>
                <td>
                <text class="header">
                    OUTRAS DESPESAS ACESSÓRIAS
                </text>
                <text class="content">
                    0,00
                </text>
                </td>
                <td>
                <text class="header">
                    VALOR DO IPI
                </text>
                <text class="content">
                    0,00
                </text>
                </td>
                <td>
                <text class="header">
                    VALOR TOTAL DA NOTA
                </text>
                <text class="content">
                    2943,80
                </text>
                </td>
            </tr>
        </tbody>
        </table>
        <table>
        <tbody>
            <td class="notbordered" colspan="10">
                <text class="content">
                TRANSPORTADOR/VOLUMES TRANSPORTADOS
                </text>
            </td>
            <tr>
                <td>
                <text class="header">
                    RAZÃO SOCIAL
                </text>
                <text class="content">
                    &nbsp;
                </text>
                </td>
                <td>
                <text class="header">
                    FRETE POR CONTA
                </text>
                <text class="content">
                    0-Remetente(CIF)
                </text>
                </td>
                <td>
                <text class="header">
                    CÓDIGO ANTT
                </text>
                <text class="content">
                    &nbsp;
                </text>
                </td>
                <td>
                <text class="header">
                    PLACA DO VEÍCULO
                </text>
                <text class="content">
                    ATW4646
                </text>
                </td>
                <td>
                <text class="header">
                    UF
                </text>
                <text class="content">
                    PR
                </text>
                </td>
                <td>
                <text class="header">
                    CNPJ/CPF
                </text>
                <text class="content">
                    &nbsp;
                </text>
                </td>
            </tr>
            <tr>
                <td colspan="2">
                <text class="header">
                    LOGRADOURO
                </text>
                <text class="content">
                    , -
                </text>
                </td>
                <td colspan="2">
                <text class="header">
                    MUNICÍPIO
                </text>
                <text class="content">
                    &nbsp;
                </text>
                </td>
                <td>
                <text class="header">
                    UF
                </text>
                <text class="content">
                    &nbsp;
                </text>
                </td>
                <td>
                <text class="header">
                    INSCRIÇÃO ESTADUAL
                </text>
                <text class="content">
                    &nbsp;
                </text>
                </td>
            </tr>
            <tr>
                <td>
                <text class="header">
                    QUANTIDADE
                </text>
                <text class="content">
                    82
                </text>
                </td>
                <td>
                <text class="header">
                    ESPÉCIE
                </text>
                <text class="content">
                    &nbsp;
                </text>
                </td>
                <td>
                <text class="header">
                    MARCA
                </text>
                <text class="content">
                    &nbsp;
                </text>
                </td>
                <td>
                <text class="header">
                    NUMERAÇÃO
                </text>
                <text class="content">
                    82
                </text>
                </td>
                <td>
                <text class="header">
                    PESO BRUTO
                </text>
                <text class="content">
                    84,46
                </text>
                </td>
                <td>
                <text class="header">
                    PESO LÍQUIDO
                </text>
                <text class="content"> 
                    82,00
                </text>
                </td>
            </tr>
        </tbody>
        </table>
        `
        let produtos =
        `
        <table aria-rowspan="15">
        <tbody>
            <td colspan="15" class="notbordered">
                <text class="content">
                DADOS DO PRODUTO/SERVIÇOS
                </text>
            </td>
            <tr>
                <td colspan="1">
                <text class="header">
                    Código
                </text>
                </td>
                <td>
                <text class="header">
                    DESCRIÇÃO DO PRODUTO/SERVIÇO
                </text>
                </td>
                <td>
                <text class="header">
                    NCW/SH
                </text>
                </td>
                <td>
                <text class="header">
                    CST
                </text>
                </td>
                <td>
                <text class="header">
                    CFOP
                </text>
                </td>
                <td>
                <text class="header">
                    UND
                </text>
                </td>
                <td>
                <text class="header">
                    V.UN.
                </text>
                </td>
                <td>
                <text class="header">
                    V.TOTAL
                </text>
                </td>
                <td>
                <text class="header">
                    BC.ICMS
                </text>
                </td>
                <td>
                <text class="header">
                    V.ICMS
                </text>
                </td>
                <td>
                <text class="header">
                    V.IPI
                </text>
                </td>
                <td>
                <text class="header">
                    ALIQ.ICMS
                </text>
                </td>
                <td>
                <text class="header">
                    APLIQ.IPI
                </text>
                </td>
            </tr>
            ${products.join("")}
        </tbody>
        </table>
        <table>
        <tbody>
            <td class="notbordered">
                <text class="content">
                CÁLCULO DO ISSQN
                </text>
            </td>
            <tr>
                <td>
                <text class="header">
                    INSCRIÇÃO MUNICIPAL
                </text>
                <text class="content">
                &nbsp;
                </text>
                </td>
                <td>
                <text class="header">
                    VALOR TOTAL DOS SERVIÇOS
                </text>
                <text class="content">
                    &nbsp;
                </text>
                </td>
                <td>
                <text class="header">
                    BASE DE CÁLCULO DE ISSQN
                </text>
                </td>
                <td>
                <text class="header">
                    VALOR DO ISSQN
                </text>
                <text class="content">
                    &nbsp;
                </text>
                </td>
            </tr>
        </tbody>
        </table>
        `
        let rest =
        `
        <table>
        <tbody>
            <td class="notbordered">
                <text class="content ">
                DADOS ADICIONAIS
                </text>
            </td>
            <tr>
                <td >
                <text class="header">
                    INFORMAÇÕES COMPLEMENTARES
                </text>
                
                <text class="header">
                    PLANO PAGAMENTO 3 14 DIAS COBRANÇA 748
                </text>
                <text class="header">
                    CARREGAMENTO: 65450 PEDIDO: 129087689 TRANSACAO 2767245 CODCLI 580
                </text>
                <text class="header">
                    RCA:129-GIOVANNI LARA
                </text>
                <text class="header">
                    FANTASIA: SUPER MARIA LUIZA CODCLI 580
                </text>
                <text class="header">
                    ENDERECO COOBRANCA: R JOSE CALDART, 1038,MARIA LUIZA,CASCAVEL-PR
                </text>
                <text class="header">
                    ICMS COM REDUCAO - CONF.ART.5.INCISO IV DA LEI N° 13.925/2004.
                </text>
                <text class="header">
                    PIS/COFINS ALIQ. ZERO CONF.ART.1°.INCISO XII, DA LEI N°10.925/2004 
                </text>
                </td>
                <td >
                <text class="header">
                    RESERVADO AO FISCO
                </text>
                </td>
            </tr>
        </tbody>
        </table>`;
        console.log('aq2')
        async function nf(req, res) {
            const { products, style, cabecalho, rest } = req.body; // Supõe-se que esses dados são enviados no corpo da requisição
            let output = `${style}${cabecalho}`;
        
            if (products.length <= 15) {
                // Adiciona os produtos na primeira página
                for (let i = 0; i < products.length; i++) {
                    output += `<div>${products[i]}</div>`; // Exemplo para exibir cada produto
                }
                output += `${rest}`;
            } else {
                // Adiciona os primeiros 15 produtos na primeira página
                for (let i = 0; i < 15; i++) {
                    output += `<div>${products[i]}</div>`;
                }
                output += `${rest}`;
        
                // Quebra de página para a segunda página
                output += `<div class="page-break"></div>`; // Classe para sinalizar quebra de página
        
                // Adiciona o estilo e cabeçalho novamente para a segunda página
                output += `${style}${cabecalho}`;
                
                // Adiciona os próximos produtos até o limite de 30
                for (let i = 15; i < Math.min(30, products.length); i++) {
                    output += `<div>${products[i]}</div>`;
                }
                output += `${rest}`;
            }
        
            res.send(output); // Envia o HTML final como resposta
        }
        
         
        
        pdf.create(nf, {
        }).toFile("./jumboalimentosnf.pdf",(err,res) => {
            if(err){
                console.log('erro :(');
            }else{
                console.log(res);
            }
        })
    }
}
module.exports = nf_controller;