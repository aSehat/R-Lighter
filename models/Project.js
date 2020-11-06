const mongoose = require('mongoose');
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
    annotations: [
        {
            type: Schema.Types.ObjectId,
            ref: 'annotation'
        }
    ],
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

