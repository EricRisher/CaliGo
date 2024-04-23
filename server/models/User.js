const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new mongoose.Schema({
    userID: {
        type: String,
        required: true,
        primaryKey: true
    },
    username: {
        type: String,
        required: true
    },
    profilePic: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
}
);

// Create and export the user model
module.exports = mongoose.model('User', userSchema);