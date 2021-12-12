const express = require('express')
const body_parser = require('body-parser')
const app = express()
const localStorage = require('localStorage')
const { body,validationResult } = require('express-validator');
const Pictures = require('../../models/Pictures');
const fs = require('fs')
var urlencorderParser = body_parser.urlencoded({extended:false})
let file;
let filename;


app.get('/',(req,res)=>{
    let user = localStorage.getItem('user');
    if(!user){
        res.redirect('/login')
    }else{
        Pictures.find()
        .then(pics=>{
            res.render('pictures',{"images":pics,'message':req.flash('message')})
        })
       
    }
   
   });



app.post('/add',urlencorderParser,(req,res)=>{
    if(req.files){
        file = req.files.picture
        filename=file.name
        file.mv('public/uploads/'+filename,function(err){
            if(err){
                res.send(err)
            }
        })
    }

    const picture =new Pictures({
        "picture_name":filename
    })
    picture.save()
    req.flash('message',"Picture Added")
    res.redirect('/pictures')

})


app.get('/delete_picture/:id/',(req,res)=>{
    Pictures.findById(req.params.id)
    .then(pic=>{
        fs.unlink('public/uploads/'+pic.picture_name,function(result){
            console.log(result)
        })
       
        
    })

    Pictures.findByIdAndDelete(req.params.id)
    .then(result=>{
        req.flash('message',"Picture Deleted successfully")
        res.redirect('/pictures')
    })
  })



   

module.exports = app