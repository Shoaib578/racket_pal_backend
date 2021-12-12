const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const PicturesSchema = new Schema({
    picture_name: {
        type: String,
       
      },
})

const Pictures = mongoose.model('Pictures', PicturesSchema);

module.exports = Pictures;