const { Sequelize } = require('sequelize');
const{ QueryTypes } = require('sequelize');
const { SELECT } = require('sequelize/lib/query-types');
const DBConnectionMenager = require('../database/DBConnectionMenager');

class City_Service{
    static async city(req,res){
        const city_Info = await DBConnectionMenager.getDefaultConnection().query( `
        SELECT
            CODFILIAL,
            FILIAL,
            CODCITY,
            CITY,
            UF
        FROM
            city_service
        where
            CITY = '${req.body.city}'
        `,
            {
                type: QueryTypes.SELECT
            }
        )
        console.log(city_Info)
      if(city_Info.length > 0){
        res.status(200).json()
      } else {
        res.status(517).json()
      }
    } 
}
module.exports = City_Service;