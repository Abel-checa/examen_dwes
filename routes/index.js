const express = require('express');
const router = express.Router();
require('dotenv').config()
const { UserModel } = require('../models/Usuarios.js')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
require('../connectionDB.js')
// const session = require('session')

router.get('/',(req,res)=>{
  res.render('Landing_page')
})
router.get('/login', function(req, res) {
  res.render('login');
});


router.post('/login', async (req, res)=>{
  
  const userFound = await UserModel.findOne({nombre: req.body.nombre})
  
  if (userFound){
    const verificacion = await bcrypt.compare(req.body.password,userFound.password)
   if(verificacion){
    //hacer Session
    const token = jwt.sign({nombre:userFound.nombre}, process.env.SECRET);
    console.log(token);
    res.redirect(`/inicio/${token}`)
   }
  }
  
});

router.get('/register', function(req, res, next) {
  res.render('register');
});


router.post('/register',async  (req,res)=>{
  const secure_password = await bcrypt.hash(req.body.password,8)
  const new_user = new UserModel({
    nombre: req.body.nombre,
    password: secure_password,
    cargo: req.body.cargo,
    imagen: req.body.imagen
  })
  await new_user.save()
  res.redirect('/login')
})

router.get('/inicio/:token',async  (req,res)=>{
  console.l;
  if(jwt.verify("eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJub21icmUiOiJsdWlzIiwiaWF0IjoxNzA4NTEyMDUwfQ.5LaoTrRRui8JnFrPqCdh7CKkBO2Zqad3cNzGYa0s6qI",process.env.SECRET)){
    console.log("verificado");
    const rol = jwt.verify(req.params.token,process.env.SECRET)
    const userFound = await UserModel.find({nombre: rol.nombre})
    if(userFound){
      res.render('inicio_usuario', {usuario: userFound})
    }
  }else{
    res.sendStatus(403)
  }
})

router.get('/añadir/:usuario',async (req,res)=>{
  const {nombre,descripcion,imagen} = req.body
  const objeto= {
    nombre: nombre,
    descripcion: descripcion,
    imagen: imagen
  }
  if(jwt.verify(req.params.token,process.env.SECRET)){
    const user = jwt.verify(req.params.token,process.env.SECRET)
    const userFound = await UserModel.findOneAndUpdate({nombre: user.nombre}, {objetos: [objeto]})
    await userFound.save()
  }else{
    res.sendStatus(403)
  }
})


router.get('/profile/:usuario',(req,res)=>{
  res.render('perfil')
})

router.get('*',(req,res)=>{
  res.render('error.ejs')
})

module.exports = router;

