const express = require('express')
const body_parser = require('body-parser')
const app = express()
var urlencorderParser = body_parser.urlencoded({extended:false})
let Club = require('../../models/Club')
let SportsInterest = require('../../models/Sports_interest')
const bcrypt = require('bcrypt');        
const saltRounds = 10; 
var fs = require('fs');



app.get('/',(req,res)=>{
    Club.aggregate([
        {$lookup:
        {
          from: 'sports_interests',
          localField: 'speciality_id',
          foreignField: '_id',
          as: 'speciality'
        }
        }
        
        ])
        .then(clubs=>{
            SportsInterest.find()
            .then(sports=>{
    
            res.render('club',{"message":req.flash('message'),"specialities":sports,"clubs":clubs});
            })
        })
       


});

app.post('/add_club',urlencorderParser,(req,res)=>{
    let file;
    let filename;
    if(req.files){
        var random = Math.floor(1000 + Math.random() * 9000);

        file = req.files.business_permit_document
        filename=random+file.name
        file.mv('public/uploads/'+filename,function(err){
            if(err){
                res.send(err)
            }
        })
    }



    const club =new Club({
        "club_name":req.body.club_name,
        "speciality_id":req.body.speciality,
        "latitude":req.body.latitude,
        "longitude":req.body.longitude,
        "buisiness_permit_document":filename,
        "number_of_courts":req.body.number_of_courts,
        "shower_rooms":req.body.shower_rooms,
        "praying_room":req.body.praying_room,
        "capacity_parking_areas":req.body.capacity_of_parking_areas,
        "snak_drink":req.body.snak_drink,
        "sports_quipment_rental_service":req.body.sports_equipment_rental_service,
        "description":req.body.description,
        "opening_time":req.body.opening_time,
        "closing_time":req.body.closing_time

    })

    club.save()
    req.flash('message','Club Added Successfully')
    res.redirect('/clubs')
});


app.get('/delete_club/:id',(req,res)=>{
    Club.findById(req.params.id)
    .then(club=>{
        fs.unlink('public/uploads/'+club.buisiness_permit_document,function(result){
            console.log(result)
        })
       
        
    })

    Club.findByIdAndDelete(req.params.id)
    .then(result=>{
        req.flash('message',"Club Deleted successfully")
        res.redirect('/clubs')
    })
})

module.exports = app