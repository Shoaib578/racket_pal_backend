const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const SportsInterestSchema = new Schema({
    name: {
        type: String,
        required: false,
        unique: false,
       
        minlength: 3
      },
})

const Sports = mongoose.model('Sports_Interest', SportsInterestSchema);

module.exports = Sports;