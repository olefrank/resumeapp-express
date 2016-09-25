var mongoose = require('mongoose');

var Education = mongoose.Schema({

    title       : { da: String, en: String },
    company     : { name: { da: String, en: String }, logo: String },
    major       : String,
    grade       : String,
    start       : Date,
    end         : Date,
    activities  : Array

});

module.exports = mongoose.model('Education', Education);