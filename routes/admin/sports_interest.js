const express = require('express')
const body_parser = require('body-parser')
const app = express()
const localStorage = require('localStorage')
const { body,validationResult } = require('express-validator');
var urlencorderParser = body_parser.urlencoded({extended:false})

let Users = require('../../models/Users')

let Sports_Interest = require('../../models/Sports_interest')

app.get('/',(req,res)=>{
    let user = localStorage.getItem('user');
    if(!user){
        res.redirect('/login')
    }else{
        Sports_Interest.find()
        .then(sports=>{
            
            res.render('sports_interest',{"sports":sports,"message":req.flash('message')})

        })
       
    }
   
   });



app.post('/add',urlencorderParser,(req,res)=>{
   
    const sports = new Sports_Interest({
        "name":req.body.name
    })
    sports.save()
    req.flash('message',"Sports Added")
    res.redirect('/sports_interest')

})


  
app.get('/delete_sports/:id/',(req,res)=>{
    

    Sports_Interest.findByIdAndDelete(req.params.id)
    .then(result=>{
        req.flash('message',"Sports Deleted successfully")
        res.redirect('/sports_interest')
    })
  })


   

module.exports = app