const mongoose = require('mongoose');
const validator = require('validator');

const User = mongoose.model('user',
    {
        name:{
            type: String,
            required: true
        },
        email:{
            type: String,
            required: true,
            validate(value){
                if(!validator.isEmail(value)){
                    throw new Error('Email is invalid');
                }
            }
        },
        age:{
            type: Number,
            required: true,
            validate(value){
                if(value <= 0 || value > 100){
                    throw new Error('Age is invalid');
                }
            }
        },
        password:{
            type: String,
            required: true,
            validate(value){
                if(value.length < 6 || value.length > 20){
                    throw new Error('Password is invalid');
                }
                if(value.toLowerCase().match(/password/)){
                    throw new Error('Password can not contain password');
                }
            }
        }
    }
)


module.exports = User;