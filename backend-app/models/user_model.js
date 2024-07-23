const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        validate: {
            validator: function (v) {
                return /\S+@\S+\.\S+/.test(v);
            },
            message: props => `${props.value} is not a valid email!`
        }
    },
    password: {
        type: String,
        required: true
    },
    mobile: {
        type: String,
        required: true,
        validate: {
            validator: function (v) {
                return /^\d{10}$/.test(v);
            },
            message: props => `${props.value} is not a valid mobile number!`
        }
    },
    role: {
        type: String,
        enum: ['user', 'admin'], // Define possible values for the role
        required: true // Set to true if role is required, or remove if optional
    }
});

const User = mongoose.model('User', userSchema, 'Users');

module.exports = User;
