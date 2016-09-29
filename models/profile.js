var mongoose = require('mongoose');

var Profile = mongoose.Schema({

    name: String,
    imageUrl: String,
    summary: { da: String, en: String }

});

module.exports = mongoose.model('Profile', Profile, 'profile');