class ReturnCampagn {

    static async campagnChosen(req, res) {
        let result = [];
        let option = req.body.option;
        // fazer checagem campanhas que o rca tem acesso
        
         
            switch(option?.toString()) {
                case "1":
                    console.log("Campanha conta corrente");
                    // Adicione ações específicas, por exemplo:
                    result.push("Campanha conta corrente escolhida");
                    break;
                case "2":
                    console.log("Campanha sinergia");
                    result.push("Campanha sinergia escolhida");
                    break;
                default:
                    console.log("Opção inválida");
            }
        
        res.json(result);
    }
}

module.exports = ReturnCampagn;