const mongoose = require('mongoose')
const uri= "mongodb://localhost:27017/mywebstore"


const db = async ()=>{
    await mongoose.connect(uri)
}

try{
    db()
    mongoose.connection.once("open",()=>{
        console.log("Conexion Exitosa");
    })
    
}catch(e){
    mongoose.connection.once("error",()=>{
        console.log("Conexion Fallida");
    })

}


module.exports = db