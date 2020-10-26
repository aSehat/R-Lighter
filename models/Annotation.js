const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const AnnotationSchema = new mongoose.Schema({
    highlight: {
        content: {
            type: String
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
            value: {
                type: String
            }
        },
        resourceid: {
            type: Schema.Types.ObjectId,
            ref: 'resource'
        }
    },
    date: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('annotation', AnnotationSchema);

