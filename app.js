require('dotenv').config()
const checkAcess = require('./checkAcess.js');
const express = require('express');
const app = express();
const data = require("./data.json");
const bodyParser = require('body-parser');
const pdf = require('html-pdf');
const path = require('path');
const { Utils } = require('sequelize');
const openTitles = require('./openTitles.js');
const secondCopyBill = require('./secondCopyBill.js');
const CheckAcessController = require('./app/controllers/CheckAcessController.js');
const BoletoController = require('./app/controllers/BoletoController.js');
const City_Service = require('./app/controllers/City_service.js');
const Confirm_Rca = require('./app/controllers/Confirm_Rca.js');


app.use(bodyParser.json()) 
app.use(bodyParser.urlencoded({ extended: true })) 

   // app.all('/api/client/City_Service', City_Service.city)
    
    
    //First whatsapp acess check
    app.use(CheckAcessController.checkAcess)
    app.use(CheckAcessController.checkAcessUser)
    
        app.post('/api/client/opentitles',openTitles)

        app.post('/api/client/secondCopyBill',secondCopyBill)
    
        app.post('/api/client/billController',BoletoController.getBillInfo)



app.listen(process.env.SERVERPORT, () => {
    console.log(`Server is running ON PORT${process.env.SERVERPORT}`)
    
})
