const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const CourtSchema = new Schema({
    court_name: {
        type: String,
        required:true
       
      },
    picture:{
        type: String,
        required:true
    },
    is_available:{
        type:Number,
       
    },
    club_id:{
        type:Schema.ObjectId,
        required:true
    }
})

const Courts = mongoose.model('Courts', CourtSchema);

module.exports = Courts;