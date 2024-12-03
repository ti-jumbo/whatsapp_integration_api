

class  CampagnRca{

    static async campagnVig(req,res){
        let result = [];
        // fazer checagem campanhas  que o rca tem acesso
        result.push({
            id:1,
            name:"Campanha Conta corrente"
        })
        result.push({
            id:2,
            name:"Campanha Sinergia"
        })

      res.json(result)  
    
    }
    static async optionMonth(req,res){
        let result = [];
        result.push({
            id:1,
            name:"Janeiro"
            })
            result.push({
                id:2,
                name:"Fevereiro"
                })
                result.push({
                    id:3,
                    name:"Março"
                    })
                    result.push({
                        id:4,
                        name:"Abril"
                        })
                        result.push({
                            id:5,
                            name:"Maio"
                            })
                            result.push({
                                id:6,
                                name:"Junho"
                                })
                                result.push({
                                    id:7,
                                    name:"Julho"
                                    })
                                    result.push({
                                        id:8,
                                        name:"Agosto"
                                        })
                                        result.push({
                                            id:9,
                                            name:"Setembro"
                                            })
                                            result.push({
                                                id:10,
                                                name:"Outubro"
                                                })
                                                result.push({
                                                    id:11,
                                                    name:"Novembro"
                                                    })
                                                    result.push({
                                                        id:12,
                                                        name:"Dezembro"
                                                        })
                                                        res.json(result);
                                                        
    }
}
module.exports = CampagnRca;