var mongoose = require('mongoose');

var Profile = mongoose.Schema({

    name: String,
    imageUrl: String,
    summary: { da: String, en: String }

});

Profile.set('toObject', { virtuals: true });

module.exports = mongoose.model('Profile', Profile, 'profile');