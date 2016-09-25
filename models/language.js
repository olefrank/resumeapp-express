var mongoose = require('mongoose');

var Language = mongoose.Schema({

    lang: { da: String, en: String },
    rating: Number

});

module.exports = mongoose.model('Language', Language);