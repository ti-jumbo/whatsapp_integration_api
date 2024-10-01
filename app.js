
const checkAcess = require('./checkAcess.js')
const express = require('express')
const app = express()
const port = 3000
const data = require("./data.json")
const bodyParser = require('body-parser')
const { Utils } = require('sequelize')

app.use(bodyParser.json()) 
app.use(bodyParser.urlencoded({ extended: true })) 

//First whatsapp acess check
app.use(function(req, res, next){
    const basicText = req.headers.authorization?.split(' ')[0] || "";
    if(basicText != 'Basic'){
        return res.status(401).json()
    }
    const base64Credentials = req.headers.authorization?.split(' ')[1] || "";
    console.log('1',base64Credentials);
    const credentials = Buffer.from(base64Credentials,'base64').toString('ascii');
    console.log('2',credentials);
    const [username, password] = credentials.split(':');
    console.log('3',username, password);
    let user = 'whatsappEZ';
    let senha = '##token#!whatsapp!#ez$@Jumbo%&*';
    
    if((username == user) && (password == senha)){
        
        next()
    } else {
          
         return res.status(401).json()
    }
})
app.use(checkAcess)

app.post('/api/client/acess', async function(req, res) {
    res.status(200).json()
   });

app.listen(port, () => {
    console.log("Server is running")
})