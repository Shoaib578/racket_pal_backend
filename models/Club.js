const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const ClubSchema = new Schema({
    club_name: {
        type: String,
        required:true
       
      },
    speciality_id:{
        type: Schema.ObjectId,
        required:true
    },
  
    latitude:{
        type:String,
        required:false,
    },
    longitude:{
        type:String,
        required:false,
    },
    

   shower_rooms:{
       type:Number,
       
   },
   number_of_courts:{
       type:Number
   },
   praying_room:{
    type:Number
   },
   capacity_parking_areas:{
       type:Number
   },
   sports_quipment_rental_service:{
       type:Number
   },
   description:{
       type:String
   },
   opening_time:{
       type:String,
   },
   closing_time:{
       type:String
   },
   snak_drink:{
       type:Number
   },
   buisiness_permit_document:{
       type:String
   },

})

const Club = mongoose.model('Club', ClubSchema);

module.exports = Club;