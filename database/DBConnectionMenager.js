
const{ Sequelize } = require('sequelize')
const OracleDB = require('oracledb')

class DBConnectionMenager{
    static #winthorConnection = null;
    static #defaultConnection = null;
    static #epConnection = null;

    static getWhintorConnection(){
        if(DBConnectionMenager.#winthorConnection == null){
            OracleDB.initOracleClient({libDir: process.env.DB_ORA_LIB_DIR});
            
            DBConnectionMenager.#winthorConnection = new Sequelize({
                'id':2,
                'username':process.env.WIUSER,
                'password':process.env.WIPASSWORD,
                'database':process.env.WIDBNAME,
                'host':process.env.WIHOST,
                'dialect':'oracle',
                'logQueryParameters': true,
                'dialectOptions':{
                    'schema':'JUMBO',
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

    static getEpConnection(){
        if(DBConnectionMenager.#epConnection == null){
            OracleDB.initOracleClient({libDir: process.env.DB_ORA_LIB_DIR});
            
            DBConnectionMenager.#epConnection = new Sequelize({
                'id':2,
                'username':process.env.EPUSER,
                'password':process.env.EPPASSWORD,
                'database':process.env.EPDBNAME,
                'host':process.env.EPHOST,
                'dialect':'oracle',
                'logQueryParameters': true,
                'dialectOptions':{
                    'schema':'EP',
                    }
            })
     
        }
        return DBConnectionMenager.#epConnection;

    }
}

module.exports = DBConnectionMenager;