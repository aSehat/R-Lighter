const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ResourceSchema = new mongoose.Schema({
    annotationId: {
        type: Schema.Types.ObjectId,
        ref: 'annotation'
    },
    name: {
        type: String
    },
    properties: {
        label: {
            type: String,
        },
        description: {
            type: String
        }
    },
    resources: [ 
        {
            annotationId: {
                type: Schema.Types.ObjectId,
                ref: 'annotation'
            },
            class: {
                type: String
            },
            name: {
                type: String
            },
            properties: {
                label: {
                    type: String,
                },
                description: {
                    type: String
                }
            }
        }
    ],
});

module.exports = mongoose.model('resource', ResourceSchema);