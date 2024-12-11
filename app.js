require('dotenv').config()
const checkAcess = require('./controllers/checkAcess.js');
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
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
const bonus = require('./controllers/Bonus.js');
const redirectionRca = require('./controllers/redirectionRca.js');
const promoters = require('./controllers/promoters.js');



app.use(bodyParser.json()) 
app.use(bodyParser.urlencoded({ extended: true })) 




//First whatsapp acess check
app.use(CheckAcessController.checkAcess)
app.use(CheckAcessController.checkAcessUser)


app.post('/api/rca/getmonth',CampagnRca.optionMonth)//listagem do mes

app.post('/api/rca/choicemonth',MonthCampagn.monthCampagn)//escolha do mes

app.post('/api/rca/listcampagnvig',CampanhaRca.campagnVig)//listagem campanha

app.post('/api/rca/campagnchosen',ReturnCampagn.campagnChosen)//Campanhas escolhida

app.post('/api/rca/getdatessynergy',campaignSynergy.getDatesSynergy)//Sinergia  

app.post('/api/rca/getdatesaccount',currentAccountCampaign.getDateAccount)//Conta corrente

app.post('/api/rca/getbonus',bonus.bonif)//bonificação

app.post('/api/rca/redirectionrca',redirectionRca.redirection)//redirecionamento do cliente para o rca

app.post('/api/promoter/promoter',promoters.promoter)//identificação promotora

app.post('/api/client/opentitles',Titles.openTitles)//Titulos em aberto

app.post('/api/client/unpaidtitles',Titles.unpaidTitle)//Titulos em a vencer

app.post('/api/client/salesdisruption',CustumizedReport.noPurchase)//Titulos em a vencer

app.post('/api/client/billcontroller',BoletoController.getBillPdf)//boleto PDF

app.post('/api/client/nfcontroller',nf_controller.NF)//nota fiscal

app.post('/api/user/checkuser', async function(req,res,next){
//checa se  o usuario existe

    res.status(200).json(req.loggedUser)

})
app.post('/api/user/login', async function(req,res,next){//checa se o ususario está logado
    res.status(200).json(req.loggedUser)
})
app.post('/api/user/cityservice', City_Service.city)//informa se atendemos a cidade informada

app.listen(process.env.SERVERPORT, () => {
    console.log(`Server is running ON PORT${process.env.SERVERPORT}`)
    
})
