require('dotenv').config()
const checkAcess = require('./checkAcess.js');
const express = require('express');
const app = express();
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




//First whatsapp acess check
app.use(CheckAcessController.checkAcess)
app.use(CheckAcessController.checkAcessUser)

app.post('/api/rca/confirm_rca',Confirm_Rca.checkRca)

app.post('/api/client/opentitles',openTitles)

app.post('/api/client/secondCopyBill',secondCopyBill)

app.post('/api/client/bill_Controller',BoletoController.getBillPdf)

app.post('/api/user/check_user', async function(req,res,next){
    console.log('aqi')
    res.status(200).json(req.loggedUser)
})
app.post('/api/user/login', async function(req,res,next){
    console.log('aqi')
    res.status(200).json(req.loggedUser)
})
app.post('/api/user/city_service', City_Service.city)

app.listen(process.env.SERVERPORT, () => {
    console.log(`Server is running ON PORT${process.env.SERVERPORT}`)
    
})
