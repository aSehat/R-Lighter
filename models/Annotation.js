const mongoose = require('mongoose');

const AnnotationSchema = new mongoose.Schema({
    content: {
        text: {
            type: String
        }
    },
    position: {
        boundingRect: {
            x1: {
                type: Number
            }, 
            y1: {
                type: Number
            },
            x2: {
                type: Number
            },
            y2: {
                type: Number
            },
            width: {
                type: Number
            },
            height: {
                type: Number
            }
        },
        rects: [
            {
                x1: {
                    type: Number
                }, 
                y1: {
                    type: Number
                },
                x2: {
                    type: Number
                },
                y2: {
                    type: Number
                },
                width: {
                    type: Number
                },
                height: {
                    type: Number
                }
            }
        ],
        pageNumber: {
            type: Number
        }
    },
    resource: {
        type: {
            type: String
        },
        resourceName: {
            type: String
        },
        property: {
            label: {
                type: String,
            },
        }
    },
    date: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('annotation', AnnotationSchema);

