const express = require('express')
const app = express()
const port = 3000
const data = require("./data.json")
const bodyParser = require('body-parser')

app.use(bodyParser.json()) // 
app.use(bodyParser.urlencoded({ extended: true })) 

app.post('/confirm_cpf', function(req, res) {
    res.json(data);
});

app.post("/confirm_cpf/:id", function(req, res){
    console.log(req.body)
    const { id } = req.params
    const comfirmCpf = data.find(cpf => cpf.id == id)
    if(req.body.cnpj == comfirmCpf.cnpj){
        res.status(200).json();
    }
    else{
        res.status(204).json();
    }
})
app.listen(port, () => {
    console.log("Server is running")
})