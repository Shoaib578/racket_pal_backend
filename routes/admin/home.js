const express = require('express')
const body_parser = require('body-parser')
const app = express()
const localStorage = require('localStorage')
const { body,validationResult } = require('express-validator');
var urlencorderParser = body_parser.urlencoded({extended:false})
var fs = require('fs');

let Users = require('../../models/Users');
const Sports = require('../../models/Sports_interest');



app.get('/',(req,res)=>{
    let user = localStorage.getItem('user');
    if(!user){
        res.redirect('/login')
    }else{
        const my_user = localStorage.getItem('user')
        const parse = JSON.parse(my_user)
       
        Users.aggregate([
            {$lookup:
            {
              from: 'sports_interests',
              localField: 'player.sports_interest',
              foreignField: '_id',
              as: 'sports'
            }
            }
            
            ])
            
            .then(users=>{
               
             Sports.find()
             .then(sports=>{
                res.render('home',{"users":users,"message":req.flash('message'),"sports":sports,"my_id":parse._id,})

             })
            
           

        })
       
    }
   
   });


  


app.get('/logout',(req,res)=>{
   const user = localStorage.removeItem('user')
   if(user == null){
       res.redirect('/login')
   }else{
       localStorage.removeItem('user')
       res.redirect('/login')

   }

})
   

module.exports = app