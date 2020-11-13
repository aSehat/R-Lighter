const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ResourceSchema = new mongoose.Schema({
    annotationId: {
        type: Schema.Types.ObjectId,
        ref: 'annotation'
    },
    class: {
        type: String
    },
    name: {
        type: String,
    },
    property: {
        label: {
            type: String,
        },
        description: {
            type: String
        }
    },
    resources: [ 
        {
            type: Schema.Types.ObjectId,
            ref: 'resource'
        }
    ],
});

module.exports = mongoose.model('resource', ResourceSchema);