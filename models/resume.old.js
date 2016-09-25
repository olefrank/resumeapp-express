// load the things we need
var mongoose = require('mongoose');
var bcrypt   = require('bcrypt-nodejs');

// define the schema for our user model
var resumeSchema = mongoose.Schema({

    local            : {
        summary      : { da: String, en: String },
        skills       : [
            {
                title: {da: String, en: String},
                rating: Number
            }
        ],
        volounteering: [
            {
                title: {da: String, en: String},
                company: {name: {da: String, en: String}, logo: String},
                locality: {da: String, en: String},
                start: Date, end: Date,
                description: {da: String, en: String}
            }
        ],
        profile      : { name: String, imageUrl: String },
        education    : [
            {
                title: { da: String, en: String },
                company: {name: {da: String, en: String}, logo: String},
                major: String, grade: String,
                start: Date, end: Date,
                activities: Array
            }
        ],
        projects    : [
            {
                title: {da: String, en: String},
                company: {name: {da: String, en: String}, logo: String},
                start: Date, end: Date,
                description: {da: String, en: String}
            }
        ],
        languages   : [
            {
                lang: { da: String, en: String },
                rating: Number
            }
        ],
        experience    : [
            {
                title: { da: String, en: String },
                company: {name: {da: String, en: String}, logo: String},
                locality: { da: String, en: String },
                start: Date, end: Date,
                description: {da: String, en: String},
                currentPosition: Boolean
            }
        ]

    }

});

// create the model for resume and expose it to our app
module.exports = mongoose.model('User', userSchema);