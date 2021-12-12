const router = require('express').Router();
var nodemailer = require('nodemailer');
require('dotenv').config();
const fs = require('fs')

let Users = require('../../models/Users')
let Sports_interest = require('../../models/Sports_interest')
const bcrypt = require('bcrypt');        
const saltRounds = 10; 





function send_mail(email,code){
  
 
  var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL,
      pass: process.env.PASSWORD
    }
  });



  var mailOptions = {
    from: 'theshoaibihsan9@gmail.com',
    to: email,
    subject: 'Racket Pal Verification Code',
    text: 'Your Verification Code is : ' + code
  };


  transporter.sendMail(mailOptions, function(error, info){
    if (error) {
     
      console.log(error);
    } else {
      
      console.log('Email sent: ' + info.response);
    }
  });
}

router.get('/get_all_sports_interests',(req,res)=>{
  Sports_interest.find()
  .then(sports=>{
    res.json({
      "sports":sports
    })
  })
})


router.post('/update_profile',async(req,res)=>{

    let user_id = req.body.user_id
    console.log(user_id+' '+req.body.role);
   
    let isplayer;
    let iscoach;
    let isclub;

    if(req.body.role == "player"){
      isplayer=1;
      iscoach=0;
      isclub=0;
    }else if(req.body.role == "coach"){
      isplayer=0;
      iscoach=1;
      isclub=0;
    }else if(req.body.role == "club"){
      isplayer=0;
      iscoach=0;
      isclub=1;
    }



    if(req.body.password &&  req.files){
      console.log("here")

      Users.findOne({_id:user_id})
      .then(user=>{
        fs.unlink('public/uploads/'+user.person.profile_image,function(result){
          console.log(result)
      })
      })


      file = req.files.picture
      filename=file.name
      file.mv('public/uploads/'+filename,function(err){
        if(err){
            res.send(err)
        }
      })
      bcrypt.hash(req.body.password,saltRounds,async(err,hash)=>{
        let filter = { _id: req.body.user_id };
        let updateDoc = {
          $set: {
           email:req.body.email,
           password:hash,
           "person.firstname":req.body.firstname,
            "is_player":isplayer,
            "is_admin":0,
            "is_coach":iscoach,
            "is_club":isclub,
           "person.lastname":req.body.lastname,
           "person.age":req.body.age,
           "person.gender":req.body.gender,
           
           "person.profile_image":filename,
           "player.sports_interest":req.body.sports_interest,
           "player.player_skill":req.body.player_skill
          
          
          },
        };
      
        await Users.updateMany(filter,updateDoc)
       
         
         
       
      })
    }else if(req.body.password.length<1 &&  req.files){
      console.log("pas")

      Users.findOne({_id:user_id})
      .then(user=>{
        fs.unlink('public/uploads/'+user.person.profile_image,function(result){
          console.log(result)
      })
      })


      file = req.files.picture
      filename=file.name
      file.mv('public/uploads/'+filename,function(err){
        if(err){
            res.send(err)
        }
    })
        let filter = { _id: req.body.user_id };
        let updateDoc = {
          $set: {
           email:req.body.email,
          
           "person.firstname":req.body.firstname,
            "is_player":isplayer,
            "is_admin":0,
            "is_coach":iscoach,
            "is_club":isclub,
           "person.lastname":req.body.lastname,
           "person.age":req.body.age,
           "person.gender":req.body.gender,
           
           "person.profile_image":filename,
           "player.sports_interest":req.body.sports_interest,
           "player.player_skill":req.body.player_skill
          
          
          },
        };
      
        await Users.updateMany(filter,updateDoc)
        
     



    }else if(req.body.password && !req.files){
      console.log("Password updateing")
      bcrypt.hash(req.body.password,saltRounds,async(err,hash)=>{
        let filter = { _id: req.body.user_id };
        let updateDoc = {
          $set: {
           email:req.body.email,
           password:hash,
           "person.firstname":req.body.firstname,
            "is_player":isplayer,
            "is_admin":0,
            "is_coach":iscoach,
            "is_club":isclub,
           "person.lastname":req.body.lastname,
           "person.age":req.body.age,
           "person.gender":req.body.gender,
           
           
           "player.sports_interest":req.body.sports_interest,
           "player.player_skill":req.body.player_skill
          
          
          },
        };
      
        await Users.updateMany(filter,updateDoc)
       
         
         
       
      })
    }
    else {

      
      let filter = { _id: user_id };
        let updateDoc = {
          $set: {
           email:req.body.email,
          
           "person.firstname":req.body.firstname,
            "is_player":isplayer,
            "is_admin":0,
            "is_coach":iscoach,
            "is_club":isclub,
           "person.lastname":req.body.lastname,
           "person.age":req.body.age,
           "person.gender":req.body.gender,
           
           
           "player.sports_interest":req.body.sports_interest,
           "player.player_skill":req.body.player_skill
          
          
          },
        };
        
        await Users.updateMany(filter,updateDoc)
        
         
         
       
     


    }
  
    res.json({
      "msg":"Profile Updated"
    })
  
  })



router.route('/register_user').post((req, res) => {
      
      let hash_password;
      let file;
      let filename;
      let isplayer;
      let iscoach;
      let isclub;
      console.log(req.body.role)
      if(req.body.role == "player"){
        isplayer=1;
        iscoach=0;
        isclub=0;
      }else if(req.body.role == "coach"){
        isplayer=0;
        iscoach=1;
        isclub=0;
      }else if(req.body.role == "club"){
        isplayer=0;
        iscoach=0;
        isclub=1;
      }


      bcrypt.hash(req.body.password,saltRounds,(err,hash)=>{
        hash_password = hash
      })

       Users.findOne({email:req.body.email})
      .then(result=>{
        if(result != null){
          res.send({
            "msg":"User Already Exist"
          })
        }else{
  
        file = req.files.picture
        filename=file.name
        file.mv('public/uploads/'+filename,function(err){
            if(err){
                res.send(err)
            }
        })
          try{
            const user = new Users({
              "email":req.body.email,
              "password":hash_password,
              "is_player":isplayer,
              "is_admin":0,
              "is_coach":iscoach,
              "is_club":isclub,
              "person.firstname":req.body.firstname,
              "person.lastname":req.body.lastname,
              "person.age":req.body.age,
              "person.gender":req.body.gender,
              
              "person.latitude":req.body.latitude,
              "person.longitude":req.body.longitude,
              "person.profile_image":filename,
              "player.sports_interest":req.body.sports_interest,
              "player.player_skill":req.body.player_skill
  
          });
          user.save()
          res.send({
            "msg":"User Registered Successfully"
          })
  
  
          }catch(err){
            console.log(err)
          }
  
  
  
  
        }
    
      })
     
     
   
  });

router.route('/login_user').post((req,res)=>{
  
 
  Users.findOne({email:req.body.email})
  .then(user=>{
   if(user != null){
    bcrypt.compare(req.body.password, user.password, function(error, response) {
      console.log(response)
     if(response == true){
       res.send({
         "user":user,
         "msg":"logged in Succesfully"
       })
     }else{
       res.send({
         "msg":"Incorrect email or password"
       })
     }
  });
   }else{
     res.send({
       "msg":"Incorrect email or password"
     })
   }
  });
    
})





router.get('/profile_screen',(req,res)=>{
  const user_id = req.query.user_id
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
    .then(user=>{
      user.map(data=>{
        if(data._id == user_id){
          return res.json({"user":data})
        }
      })
    })
  
})



router.post('/forgot_password',(req,res)=>{
  var random_digits = Math.floor(1000 + Math.random() * 9000);
  Users.findOne({email:req.body.email})
  .then(result=>{
    if(result != null){
      send_mail(result.email,random_digits)

      res.send({
        "msg":"Verification Code Sent",
        "user_id":result._id,
        "otp":random_digits
      })
    }else{
      res.send({
        "msg":"User Does'nt Exist"
      })
    }
  
  
  })


})



router.post('/create_new_password',async(req,res)=>{
  const user_id = req.body.user_id
  let password = req.body.password
  
  bcrypt.hash(password,saltRounds,async(err,hash)=>{
    let filter = { _id: user_id };
    let updateDoc = {
      $set: {
       
       password:hash,
      
      
      },
    };
  
    await Users.updateMany(filter,updateDoc)
    Users.findById(user_id)
    .then(result=>{
     
       res.send({
         "msg":"Password Has Been Updated"
       })
    })
  })
  
  
  

  



  

})
module.exports = router;
