// importação do modulo express para o node
const express = require("express");
const { application } = require("express");

//importação do modulo body-parser para realizar o trabalho com json que sera enviado pelo cliente
const bodyParser = require("body-parser");

//importação do mongoose para realizar a persistencia com mongodb
const mongoose = require("mongoose");

//importação do moduilo bcrypt para encriptografar senhas
const bcrypt = require('bcryptjs')

//importação do modulo do jsonwebtoken
const jwt = require('jsonwebtoken')

//importação do modulo local de configurações. aqui temos o caminho do banco de dados e do jwt
const settings = require("./config/settings")

//importação do modulo local com as configurações do modelo de dados de clientes
const cliente = require("./model/cliente")

//importação do modulo do CORS para nossa aplicação
const cors = require("cors");
const autentica = require("./middleware/autentica");

// utilizar o express na nossa aplicação
const app = express();

//utilizando o body-parser em nossa aplicação para realizar o parse para json
// de dados enviados pelo front a nossa aplicação
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//configuração do cors para aceitar a solitação de diversas origins e
//status code 200 para dispositivos antigos e smartv
const optionsConfig = {
    origin: "*",
    optionsSucessStatus:200
}

//Gerar token ao usuario
const createUserToken = (id,usuario,nome)=>{
    return jwt.sign({id:id,usuario:usuario,nome:nome},settings.jwt_key,{expiresIn:settings.jwt_expires})
}

module.exports = createUserToken;

mongoose.connect(settings.dbpath,{useNewUrlParser:true,useUnifiedTopology:true});

app.get("/",cors(optionsConfig),(req,res)=>{
    cliente.find((erro, dados)=>{
        if(erro){
            res.status(400).send({erro: `Erro ao tentar listar os clientes ${erro}`})
            return
        }
        res.status(200).send({rs:dados})
    }).select("-senha");
});

app.post("/login",(req,res)=>{
    const usuario = req.body.usuario
    const senha = req.body.senha
    cliente.findOne({usuario:usuario},(err,data)=>{
        if(err) res.send({erro:"Erro ao buscar usuario"})
        if(!data) return res.send({erro:"Usuario nao cadastrado"})
        bcrypt.compare(senha,data.senha,(err,mesma)=>{
            if(!mesma) return res.send({erro:"Erro ao autenticar o usuario"})
            const token = createUserToken(data._id,data.usuario,data.nome)
            var myquery = { usuario:usuario };
            var newvalues = { token: token, usuario:usuario};
            cliente.updateOne(myquery, newvalues, function(err, res){
                if (err) throw err;
                console.log("token adicionado");
              });
            res.status(200).send({rs:"Usuario Autenticado",token:token})
        })
    })
});

app.post("/cadastro",(req,res)=>{
    const dados = new cliente(req.body);
    dados.save().then(()=>{
        res.status(201).send({rs:"Dados cadastrados com sucesso"})
    }).catch((erro)=>{
        if(erro.code === 11000){
            res.status(400).send({rs:"Usuario existente. Por favor tente outro."})
        }
        res.status(400).send({rs: `Erro ao tentar cadastrar ${erro}`})
    })
});

app.put("/atualizar/:id",cors(optionsConfig),(req,res)=>{
    cliente.findByIdAndUpdate(req.params.id,req.body,{new:true},(erro, dados)=>{
        if(erro){
            res.status(400).send({erro:`Erro ao tentar atualizar ${erro}`});
            return
        }
        res.status(200).send({rs:dados});
    });  
});

app.delete("/apagar/:id",cors(optionsConfig),(req,res)=>{
    cliente.findByIdAndDelete(req.params.id,(erro,dados)=>{
        if(erro){
            res.status(400).send({erro:`Erro ao tentar apagar ${erro}`})
            return
        }
        res.status(204).send({rs:"Cliente apagado"});
    });
});

app.use((req,res)=>{
    res.type("application/json");
    res.status(404).send('404 - Not Found');
});

app.listen(3000, ()=>console.log("Servidor online na porta 3000. Para encerrar tecle CTRL+C"))