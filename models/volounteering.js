var mongoose = require('mongoose');

var Volounteering = mongoose.Schema({

    title: { da: String, en: String },
    company: { name: { da: String, en: String }, logo: String },
    locality: { da: String, en: String },
    start: Date,
    end: Date,
    description: { da: String, en: String }

});

module.exports = mongoose.model('Volounteering', Volounteering);