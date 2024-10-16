console.log(process.env)
const{ Sequelize } = require('sequelize')
const{ QueryTypes } = require('sequelize')
const OracleDB = require('oracledb')

class DBConnectionMenager{
    static #winthorConnection = null;
    static #defaultConnection = null;

    static getWhintorConnection(){
        if(DBConnectionMenager.#winthorConnection == null){
            OracleDB.initOracleClient() 
            
            DBConnectionMenager.#winthorConnection = new Sequelize({
                'id':2,
                'username':'JUMBO',
                'password':'JUMBO',
                'database':'WINT',
                'host':'192.168.2.42',
                'dialect':'oracle',
                'logQueryParameters': true,
                'dialectOptions':{
                    'schema':'JUMBO'
                    }
            })
     
        }
        return DBConnectionMenager.#winthorConnection;

    }
    
    static getDefaultConnection(){
        if(DBConnectionMenager.#defaultConnection == null){
      
            DBConnectionMenager.#defaultConnection = new Sequelize({
                'id':2,
                'username':process.env.DBUSER,
                'password':process.env.DBPASSWORD,
                'database':process.env.DBNAME,
                'host':process.env.DBHOST,
                'port':process.env.DBPORT,
                'dialect':'mysql',
                'logQueryParameters': true
            })
            
        }
        return DBConnectionMenager.#defaultConnection;
    }
}

module.exports = DBConnectionMenager;