const mongoose = require('mongoose');

const Scema = mongoose.Schema;

const PostScema = new Scema({

    user: {
        type: Scema.Types.ObjectId,
        ref: 'users'
    },
    text: {
        type: String,
        required: true
    },
    name: {
        type: String,
    },
    avatar: {
        type: String,
    },
    likes: [
        {
            user: {
                type: Scema.Types.ObjectId,
                ref: 'users'
            }

        }
    ],
    comments: [
        {
            user: {
                type: Scema.Types.ObjectId,
                ref: 'users'
            },

            text: {
                type: String,
                required: true
            },
            name: {
                type: String,
            },
            avatar: {
                type: String,
            },
            date:{
                type:Date,
                default:Date.now
            }
        }
    ],
});
module.exports= Post= mongoose.model('post',PostScema);