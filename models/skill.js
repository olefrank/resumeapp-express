var mongoose = require('mongoose');

var Skill = mongoose.Schema({

    title: { da: String, en: String },
    rating: Number

});

module.exports = mongoose.model('Skill', Skill);