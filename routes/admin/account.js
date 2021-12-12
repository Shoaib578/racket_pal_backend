const express = require('express')
const body_parser = require('body-parser')
const app = express()
var urlencorderParser = body_parser.urlencoded({extended:false})
let Users = require('../../models/Users')
const localStorage = require('localStorage')

const bcrypt = require('bcrypt');        
const saltRounds = 10; 




app.get('/',(req,res)=>{
const my_user = localStorage.getItem('user')
let user_info = JSON.parse(my_user)  

res.render('account',{"message":req.flash('message'),"user":user_info});
});




async function update(email,fullname,hash,req,res){
  const my_user = localStorage.getItem('user')
  const user_info = JSON.parse(my_user)

  let filter = { _id: user_info._id };
  let updateDoc = {
    $set: {
     email:email,
     password:hash,
     "person.firstname":fullname
    
    },
  };

  await Users.updateMany(filter,updateDoc)
  Users.findById(user_info._id)
  .then(result=>{
   
     localStorage.setItem('user',JSON.stringify(result))
  })
  req.flash('message','Updated')
  res.redirect('/account')

}

app.post('/update_account',urlencorderParser,(req,res)=>{
   
    
    bcrypt.hash(req.body.password,saltRounds,(err,hash)=>{
      update(req.body.email,req.body.full_name,hash,req,res)
       
    })


     
})


module.exports = app