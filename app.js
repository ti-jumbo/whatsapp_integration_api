require('dotenv').config()
const checkAcess = require('./controllers/checkAcess.js');
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const secondCopyBill = require('./controllers/secondCopyBill.js');
const CheckAcessController = require('./controllers/CheckAcessController.js');
const BoletoController = require('./controllers/BoletoController.js');
const nf_controller = require('./controllers/NF.js');
const CampanhaRca = require('./controllers/Campagn.js');
const ReturnCampagn = require('./controllers/getCampagn.js');
const CampagnRca = require('./controllers/Campagn.js');
const MonthCampagn = require('./controllers/MonthCampagn.js');
const City_Service = require('./controllers/City_Service.js');
const Titles = require('./controllers/Titles.js');
const CustumizedReport = require('./controllers/custumizedreport.js');
const campaignSynergy = require('./controllers/campaignSynergy.js');
const currentAccountCampaign = require('./controllers/CurrentAccountCampaign.js');


app.use(bodyParser.json()) 
app.use(bodyParser.urlencoded({ extended: true })) 




//First whatsapp acess check
app.use(CheckAcessController.checkAcess)
app.use(CheckAcessController.checkAcessUser)


app.post('/api/rca/get_month',CampagnRca.optionMonth)//listagem do mes

app.post('/api/rca/choice_month',MonthCampagn.monthCampagn)//escolha do mes

app.post('/api/rca/listcampagnvig',CampanhaRca.campagnVig)//listagem campanha

app.post('/api/rca/campagnchosen',ReturnCampagn.campagnChosen)//Campanhas escolhida

app.post('/api/rca/getdatessynergy',campaignSynergy.getDatesSynergy)//Sinergia  

app.post('/api/rca/getdatesaccount',currentAccountCampaign.getDateAccount)//Conta corrente

app.post('/api/client/opentitles',Titles.openTitles)//Titulos em aberto

app.post('/api/client/unpaidtitles',Titles.unpaidTitle)//Titulos em a vencer

app.post('/api/client/salesDisruption',CustumizedReport.noPurchase)//Titulos em a vencer

app.post('/api/client/secondCopyBill',secondCopyBill)//segunda copia boleto

app.post('/api/client/bill_Controller',BoletoController.getBillPdf)//boleto PDF

app.post('/api/client/nf_controller',nf_controller.NF)//nota fiscal

app.post('/api/user/check_user', async function(req,res,next){
//checa se  o usuario existe

    res.status(200).json(req.loggedUser)

})
app.post('/api/user/login', async function(req,res,next){//checa se o ususario está logado
    res.status(200).json(req.loggedUser)
})
app.post('/api/user/city_service', City_Service.city)//informa se atendemos a cidade informada

app.listen(process.env.SERVERPORT, () => {
    console.log(`Server is running ON PORT${process.env.SERVERPORT}`)
    
})
