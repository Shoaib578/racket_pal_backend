const express = require('express')
const body_parser = require('body-parser')
const app = express()
var urlencorderParser = body_parser.urlencoded({extended:false})
var fs = require('fs');
let Users = require('../../models/Users')
let localStorage = require('localStorage')
const bcrypt = require('bcrypt');        
const saltRounds = 10; 




function create_admin(){
    let hash_password;
    bcrypt.hash('admin26',saltRounds,(err,hash)=>{
        hash_password = hash
      })
    
     Users.findOne({is_admin:1})
     .then(user=>{
         if(user != null){
          console.log('Already Exist')
          
         }else{
            const user = new Users({
                "email":'theadmin26@gmail.com',
                "password":hash_password,
                "is_player":0,
                "is_admin":1,
                "is_coach":0,
                "is_club":0,
                "person.firstname":'Admin',
                "person.lastname":'manage',
                "person.age":18,
                "person.gender":'Male',
               
                "person.profile_image":'adminImage',
                
                "player.player_skill":'other'
    
            });
            user.save()
            console.log('Admin Registered')
            
         }
     })
}



app.get('/login',(req,res)=>{

create_admin()
const user = localStorage.getItem('user');
if(user != null){
return res.redirect('/')
}
res.render('login',{
    "alert":'null'
})



});


app.post('/login',urlencorderParser,(req,res)=>{
   console.log(req.body)


    Users.findOne({email:req.body.email,is_admin:1})
    .then(user=>{
     if(user != null){
      bcrypt.compare(req.body.password, user.password, function(error, response) {
        console.log(response)
       if(response == true){
         localStorage.setItem('user',JSON.stringify(user))
         res.redirect('/')
       }else{
        res.render('login',{
            "alert":"Incorrect email or password"
        })

       }
    });
     }else{
        res.render('login',{
            "alert":"Incorrect email or password"
        })
     }
    });
})


app.post('/add_user',urlencorderParser,(req,res)=>{
    

    let file;
    let filename;
    let hash_password;
    let iscoach;
    let isplayer;
    let isadmin;
    let isclub;


    if(req.body.role == "player"){
      isplayer = 1;
      iscoach = 0;
      isadmin=0;
      isclub=0;
    }else if(req.body.role == "admin"){
      isplayer = 0;
      iscoach = 0;
      isadmin=1;
      isclub=0;
    }else if(req.body.role == "club"){
      isplayer = 0;
      iscoach = 0;
      isadmin=0;
      isclub=1;
    }else if(req.body.role == "coach"){
      isplayer = 0;
      iscoach = 1;
      isadmin=0;
      isclub=0;
    }

    bcrypt.hash(req.body.password,saltRounds,(err,hash)=>{
      hash_password = hash
    })

     Users.findOne({email:req.body.email})
    .then(result=>{
      if(result != null){
       req.flash('message','User Already Exists.Please Try Another One Email or Password')
       res.redirect('/')
      }else{
        
        if(req.files){
          var random = Math.floor(1000 + Math.random() * 9000);
            file = req.files.profile_image
            filename=random+file.name
            file.mv('public/uploads/'+filename,function(err){
                if(err){
                    res.send(err)
                }
            })
        }
        


        try{
          const user = new Users({
            "email":req.body.email,
            "password":hash_password,
            "is_player":isplayer,
            "is_admin":isadmin,
            "is_coach":iscoach,
            "is_club":isclub,
            "person.firstname":req.body.firstname,
            "person.lastname":req.body.lastname,
            "person.age":req.body.age,
            "person.gender":req.body.gender,
            
            "person.profile_image":filename,
            "player.sports_interest":req.body.sports_interest,
            "player.player_skill":req.body.player_skill

        });
        user.save()
        req.flash('message','User Added Successfully')
        res.redirect('/')


        }catch(err){
          console.log(err)
        }




      }
    })
    .catch(err=>{
        req.flash('message',err)
        res.redirect('/')
    })
})


app.get('/delete_user/:id/',(req,res)=>{
    Users.findById(req.params.id)
    .then(user=>{
        fs.unlink('public/uploads/'+user.person.profile_image,function(result){
            console.log(result)
        })
       
        
    })

    Users.findByIdAndDelete(req.params.id)
    .then(result=>{
        req.flash('message',"Deleted successfully")
        res.redirect('/')
    })
  })







module.exports = app