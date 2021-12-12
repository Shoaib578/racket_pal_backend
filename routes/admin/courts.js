const express = require('express')
const body_parser = require('body-parser')
const app = express()
var urlencorderParser = body_parser.urlencoded({extended:false})
var fs = require('fs');
let Club = require('../../models/Club')
let Court = require('../../models/Courts')
const bcrypt = require('bcrypt');        
const saltRounds = 10; 



app.get('/',(req,res)=>{


Court.aggregate([
    {$lookup:
    {
      from: 'clubs',
      localField: 'club_id',
      foreignField: '_id',
      as: 'club'
    }
    }
    
    ])
    .then(courts=>{
        console.log(courts)
        Club.find()
        .then(clubs=>{
        res.render('courts',{"message":req.flash('message'),"clubs":clubs,"courts":courts});
    
        })
    })

   




});



app.post('/add_court',(req,res)=>{
    if(req.files){
        var random = Math.floor(1000 + Math.random() * 9000);

        file = req.files.court_picture
        filename=random+file.name
        file.mv('public/uploads/'+filename,function(err){
            if(err){
                res.send(err)
            }
        })
    }



    const court = new Court({
        "court_name":req.body.court_name,
        "picture":filename,
        "is_available":req.body.is_available,
        "club_id":req.body.club
    })
    court.save()
    req.flash('message','Court Added')
    res.redirect('/courts')
});


app.get('/delete_court/:id',(req,res)=>{

    Court.findById(req.params.id)
    .then(court=>{
        fs.unlink('public/uploads/'+court.picture,function(result){
            console.log(result)
        })
       
        
    })

    Court.findByIdAndDelete(req.params.id)
    .then(result=>{
        req.flash('message',"Deleted successfully")
        res.redirect('/courts')
    })
});

module.exports = app