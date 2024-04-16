const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    phone: {
        type: Number,
        required: true
    },
    image: {
        type: String,
        required: true
    },
    created: {
        type: Date,
        default: Date.now,
        required: true
    }
});

module.exports = mongoose.model('users', userSchema);