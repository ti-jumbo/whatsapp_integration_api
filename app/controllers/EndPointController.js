

class EndPointController {

    static #unRestrictEndPoints =[
        {
            endPoint:"/api/client/city_service",
            methods:["POST"]
        }
    ]
    static getunRestrictEndPoints(){
        return EndPointController.#unRestrictEndPoints;
    }
}

Object.freeze(EndPointController)

module.exports = EndPointController 