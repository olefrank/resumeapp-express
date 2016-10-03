var mongoose = require('mongoose');

var Education = mongoose.Schema({

    title       : { da: String, en: String },
    company     : { name: { da: String, en: String }, logo: String, link: String },
    rating      : Number,
    start       : Date,
    end         : Date,
    courses     : { da: Array, en: Array }

});

module.exports = mongoose.model('Education', Education);