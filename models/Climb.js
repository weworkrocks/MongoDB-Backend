const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const climbSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'users'
    },
    location: {
        type: String,
        required: true
    },
    climbScore: {
        type: Number,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    }
});

module.exports = Post = mongoose.model('climb', climbSchema);