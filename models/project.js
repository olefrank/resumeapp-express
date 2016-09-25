var mongoose = require('mongoose');

var Project = mongoose.Schema({

    title: { da: String, en: String },
    company: { name:  {da: String, en: String }, logo: String },
    start: Date,
    end: Date,
    description: { da: String, en: String }

});

module.exports = mongoose.model('Project', Project);