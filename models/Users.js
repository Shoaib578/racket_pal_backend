const mongoose = require('mongoose');

const Schema = mongoose.Schema;


const person = {
  firstname:{
    type:String,
    required:true,
    unique:false,
    minlength:3
  },
  lastname:{
    type:String,
    required:true,
    unique:false,
    minlength:3
  },
  age:{
    type:Number,
    required:true,
    
  },
  gender:{
    type:String,
    required:true
  },
 
  profile_image:{
    type:String,
    
  },longitude:{
    type:Number,
    
  },
  latitude:{
    type:Number
  },
  
}


const player = {
  sports_interest:
    {
        type: Schema.ObjectId,
        required:false
       
        
    },
  player_skill:{
    type:String,
    required:true
  }
}


const userSchema = new Schema({
  person,
  player,
  email: {
    type: String,
    required: false,
    unique: false,
    trim: true,
    minlength: 3
  },
  password:{
    type:String,
    required:true,
    minlength:3
  },
  
  is_player:{
    type:Number,
    required:true,
   
  },
  is_admin:{
    type:Number,
    required:true,
   
  },
  is_coach:{
    type:Number,
    required:true,
   
  },
  
  is_club:{
    type:Number,
    required:true,
   
  },


}, {
  timestamps: true,
});

const Users = mongoose.model('Users', userSchema);

module.exports = Users;