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
    
    rdfContent: {
        annotations: [
            {
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
                    properties: {
                        label: {
                            type: String,
                        },
                        description: {
                            type: String
                        }
                    }
                }
            }
        ]
    },
    language: {
        type: String,
        default: 'EN'
    },
    date: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('project', ProjectSchema);

