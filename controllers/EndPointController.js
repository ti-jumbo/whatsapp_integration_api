

class EndPointController {

    static #unRestrictEndPoints =[
        {
            endPoint:"/api/user/city_service",
            methods:["POST"],
            
        },
        {
            endPoint:"/api/rca/choice_month",
            methods:["POST"]
        },
        {
            endPoint:"/api/promoter/promoter",
            methods:["POST"]
        },
        {
            endPoint:"/api/client/unpaid_titles",
            methods:["POST"]
        },
        {
            endPoint:"/api/client/sales_disruption",
            methods:["POST"]
        }    
          
    ]
    static getunRestrictEndPoints(){
        return EndPointController.#unRestrictEndPoints;
    }
}

Object.freeze(EndPointController)

module.exports = EndPointController 