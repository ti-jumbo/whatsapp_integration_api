class MonthCampagn{

    static monthCampagn(req,res) {
        let result = ["Janeiro","Fevereiro","Março","Abril","Maio","Junho","Julho","Agosto","Setembro","Outubro","Novembro","Dezembro"]
        let i = req.body.indice;
        res.json(result[i]);

    
        switch (result[i]) {
            case "Janeiro":
                console.log("Você escolheu ver a campanha do mês de Janeiro")
            break;
            case "Fevereiro":
                console.log("Você escolheu ver a campanha do mês de Fevereiro")
            break;
            case "Março":
                console.log("Você escolheu ver a campanha do mês de Março")
            break;
            case "Abril":
                console.log("Você escolheu ver a campanha do mês de Abril")
            break;
            case "Maio":
                console.log("Você escolheu ver a campanha do mês de Maio")
            break;
            case "Junho":
                console.log("Você escolheu ver a campanha do mês de Junho")
            break;
            case "Julho":
                console.log("Você escolheu ver a campanha do mês de Julho")
            break;
            case "Agosto":
                console.log("Você escolheu ver a campanha do mês de Agosto")
            break;
            case "Setembro":
                console.log("Você escolheu ver a campanha do mês de Setembro")
            break;
            case "Outubro":
                console.log("Você escolheu ver a campanha do mês de Outubro")
            break;
            case "Novembro":
                console.log("Você escolheu ver a campanha do mês de Novembro")
            case  "Dezembro":
                console.log("Você escolheu ver a campanha do mês de Dezembro")

            default:
                console.log("Você escolheu um mês inválido")
                break;
        }
    }

}
module.exports = MonthCampagn;

