const pdf = require("html-pdf");


class AvisoDesenvolvimento {

    static async HTMLAviso(req,res) {
        try {
            let content =`
            <!DOCTYPE html>
                <html>
                    <head>
                        <body>
                            <p1 style="color:rgb(48, 102, 17); font-size:xx-large;">
                                Pagina em desenvolvimento...
                            </p1>
                        </body>
                    </head>
                </html>
            `
            pdf.create(content, {
            }).toFile("./AvisoDesenvolvimento",(err,res) => {
                if(err){
                    console.log('erro :(');
                }else{
                    console.log(res);
                }
            })
            res.status(200).send(content)
        
        } catch(error) {
            res.send(402).json("Pagina não encontrada, contate o suporte tecnico da empresa")
        }
    }
}
module.exports = AvisoDesenvolvimento;