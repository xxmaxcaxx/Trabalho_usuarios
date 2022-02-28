//importação do mongoose para realizar a persistencia com mongodb
const mongoose = require("mongoose");
//importação do modulo bcrypt para encriptografar senhas
const bcrypt = require('bcryptjs');
//Criação do esquema de dados da tabela. Campos da tabela
const tabela = new mongoose.Schema({
    usuario:{type:String, unique:true},
    email:{type:String, required:true},
    senha:String,
    nome:{type:String, required:true},
    telefone:String,
    token:String,
    datacadastro:{type:Date, default: Date.now}
})
//Criação de uma função para encriptografar a senha
tabela.pre('save',function(next){
    let cliente = this
    if(!cliente.isModified('senha')) return next()
    bcrypt.hash(cliente.senha,10,(err,encr)=>{
        cliente.senha = encr
        return next()
    })
})
//construção de tabela com o comando model
module.exports = mongoose.model('tbcliente',tabela);