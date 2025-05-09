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
const campaignSynergy = require('./controllers/CampaignSynergy2024.js');
const currentAccountCampaign = require('./controllers/CurrentAccountCampaign.js');
const bonus = require('./controllers/Bonus.js');
const redirectionRca = require('./controllers/redirectionRca.js');
const promoters = require('./controllers/promoters.js');
const CheckClient = require('./controllers/checkClient.js');
const campaignSynergy2025 = require('./controllers/CampaignSynergy2025.js');
const AvisoDesenvolvimento = require('./controllers/AvisoDesenvolvimento.js');



app.use(bodyParser.json()) 
app.use(bodyParser.urlencoded({ extended: true })) 




//First whatsapp acess check
app.use(CheckAcessController.checkAcess)
app.use(CheckAcessController.checkAcessUser)


app.post('/api/rca/get_month',CampagnRca.optionMonth)//listagem do mes

app.post('/api/rca/choice_month',MonthCampagn.monthCampagn)//escolha do mes

app.post('/api/rca/list_campagn_vig',CampanhaRca.campagnVig)//listagem campanha

app.post('/api/rca/campagn_chosen',ReturnCampagn.campagnChosen)//Campanhas escolhida

app.post('/api/rca/get_dates_synergy',campaignSynergy.getDatesSynergy)//Sinergia  

app.post('/api/rca/get_dates_account', AvisoDesenvolvimento.HTMLAviso)//Conta corrente

app.post('/api/rca/get_bonus',bonus.bonif)//bonificação

app.post('/api/rca/redirection_rca',redirectionRca.redirection)//redirecionamento do cliente para o rca

app.post('/api/promoter/promoter',promoters.promoter)//identificação promotora

app.post('/api/client/open_titles',Titles.openTitles)//Titulos em aberto

app.post('/api/client/unpaid_titles',Titles.unpaidTitle)//Titulos em a vencer

app.post('/api/client/sales_disruption',CustumizedReport.noPurchase)//Titulos em a vencer

app.post('/api/client/bill_controller',BoletoController.getBillPdf)//boleto PDF

app.post('/api/user/check_user', async function(req,res,next){
//checa se  o usuario existe

    res.status(200).json(req.loggedUser)

})
app.post('/api/user/login', async function(req,res,next){//checa se o ususario está logado
    res.status(200).json(req.loggedUser)
})
app.post('/api/user/city_service', City_Service.city)//informa se atendemos a cidade informada

app.post('/api/user/check_client', CheckClient.checkClient)

app.post('/api/user/sinergy_seller', campaignSynergy2025.campaignSynergy2025)//campanha sinergia 2025-EM DESENVOLVIMENTO

app.listen(process.env.SERVERPORT, () => {
    console.log(`Server is running ON PORT${process.env.SERVERPORT}`)
    
})
