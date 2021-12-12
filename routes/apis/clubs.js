const router = require('express').Router();
const Clubs = require('../../models/Club')
let Users = require('../../models/Users')

router.get('/get_all_clubs',(req,res)=>{
Clubs.find()
.then(clubs=>{
    return res.json({
        "clubs":clubs
    })
})
})

router.post('/changeuserlocation',async(req,res)=>{
   
    let user_id = req.body.user_id
    let filter = { _id: user_id };
          let updateDoc = {
            $set: {
             "person.latitude":req.body.latitude,
             "person.longitude":req.body.longitude
            }
          }
      await Users.updateMany(filter,updateDoc)
      res.json({
        "msg":"Location Changed"
      })     
  })


  
router.get('/search_club',(req,res)=>{
    let search = req.query.club_title 
    var regex = new RegExp(search,'i')
    Clubs.find({club_name:regex})
    .then(clubs=>{
        console.log(clubs)
        res.json({"clubs":clubs})
    })
})

router.get('/view_club',(req,res)=>{
    const id = req.query.club_id
    
    Clubs.findOne({_id:id})
    .then(club=>{
        res.json({
            "club":club
        })
    })
})

module.exports = router