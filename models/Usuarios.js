const {Schema,model} = require('mongoose')

const UserSchema = new Schema({
    nombre: String,
    password: String,
    cargo: String,
    objetos: Array
})


const UserModel = model('usuarios', UserSchema)

module.exports = { UserModel:UserModel}

