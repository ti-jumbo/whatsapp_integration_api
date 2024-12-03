

class EndPointController {

    static #unRestrictEndPoints =[
        {
            endPoint:"/api/user/city_service",
            methods:["POST"],
            
        },
        {
            endPoint:"/api/rca/get_month",
            methods:["POST"]
        },
        {
            endPoint:"/api/rca/listcampagnvig",
            methods:["POST"]
        },
        {
            endPoint:"/api/rca/choice_month",
            methods:["POST"]
        },
        {
            endPoint:"/api/rca/campagnchosen",
            methods:["POST"]
        }
    ]
    static getunRestrictEndPoints(){
        return EndPointController.#unRestrictEndPoints;
    }
}

Object.freeze(EndPointController)

module.exports = EndPointController 