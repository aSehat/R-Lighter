const mongoose = require('mongoose');
const Annotation = require('./Annotation').schema;
const Schema = mongoose.Schema;

const ProjectSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    owner: {
        type: Schema.Types.ObjectId,
        ref: 'user'
    },
    bibtex: {
        type: String,
        default: ""
    },
    users: [
        {
            type: Schema.Types.ObjectId,
            ref: 'user'
        }
    ],
    link: {
        type: String,
        required: true
    },
    annotations: [Annotation],
    resources: [
        {
            type: Schema.Types.ObjectId,
            ref: 'resource'
        }
    ],
    language: {
        type: String,
        default: 'en'
    },
    prefix: {
        type: String,
    },
    date: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('project', ProjectSchema);

