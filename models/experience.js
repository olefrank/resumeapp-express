var mongoose = require('mongoose');

var Experience = mongoose.Schema({

    title: { da: String, en: String },
    company: { name: { da: String, en: String }, logo: String, link: String },
    locality: { da: String, en: String },
    start: Date,
    end: Date,
    description: { da: String, en: String },
    currentPosition: Boolean

});

module.exports = mongoose.model('Experience', Experience);