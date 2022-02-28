//importação do modulo do jsonwebtoken
const jwt = require('jsonwebtoken')
const settings = require("../config/settings")
const autentica = (req,res,next)=>{
    const token_gerado = req.headers.token

    jwt.verify(token_gerado,settings.jwt_key,(erro,dados)=>{
        if(erro){
            res.status(401).send({rs:`Token invalido ${erro}`})
            return
        }
        req.content={
            id:dados.id,
            usuario:dados.usuario,
            nome:dados.nome
        }
        return next();
    })
}
module.exports = autentica;