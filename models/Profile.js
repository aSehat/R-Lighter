const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ProfileSchema = new mongoose.Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'user'
    },
    bio: {
        type: String
    },
    company: {
        type: String
    },
    location: {
        type: String
    },
    projects: [
        {
        	name: {
        		type: String
                required: true
        	},
            owner: {
                type: Schema.Types.ObjectId,
                ref: 'user'
            },
            users: [
                {
                    type: [
                        type: Schema.Types.ObjectId,
                        ref: 'user'
                    ]
                }
            ],
            link: {
                type: String
                required: true
            },
            rdfContent: {
                type: String
                // This is temporary. But this will essentially hold the beef of the project
                // Structuring coming soon...
            }
            date: {
                type: Date,
                default: Date.now
            }
        }
    ],
    date: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('profile', ProfileSchema);
