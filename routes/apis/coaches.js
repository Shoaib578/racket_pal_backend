const router = require('express').Router();
const Users = require('../../models/Users')




router.get('/get_all_coaches',(req,res)=>{
    Users.find({is_coach:1})
    .then(coaches=>{
        res.json({
            "coaches":coaches
        })
    })
})

router.get('/search_coaches',(req,res)=>{
    console.log(req.query.search)
    var regex = new RegExp(req.query.search,'i')
    
    
    Users.find({$or: [ { is_coach:1,"person.firstname":regex }, { is_coach:1,"person.lastname":regex } ]})
    .then(coaches=>{
        console.log(coaches)
        res.json({
            "coaches":coaches
        })
    })
})

router.get('/view_coach',(req,res)=>{
    const coach_id = req.query.coach_id
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
        .then(coach=>{
            coach.map(data=>{
            if(data._id == coach_id){
              return res.json({"coach":data})
            }
          })
        })
})

module.exports = router