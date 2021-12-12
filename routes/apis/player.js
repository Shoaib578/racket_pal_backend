const router = require('express').Router();
const Users = require('../../models/Users')


router.get('/get_players',(req,res)=>{


Users.find({is_player:1})
.then(players=>{
    res.json({
        "players":players
    })
})


})

router.get('/search_players',(req,res)=>{
    console.log(req.query.search)
    var regex = new RegExp(req.query.search,'i')
    
    
    Users.find({$or: [ { is_player:1,"person.firstname":regex }, { is_player:1,"person.lastname":regex } ]})
    .then(players=>{
        console.log(players)
        res.json({
            "players":players
        })
    })
})

router.get('/view_player',(req,res)=>{
    
    const player_id = req.query.player_id
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
        .then(players=>{
            players.map(data=>{
            if(data._id == player_id){
              return res.json({"player":data})
            }
          })
        })
})


module.exports = router