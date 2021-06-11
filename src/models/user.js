const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Task = require('./task');

const userSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true
    },
    email:{
        type: String,
        unique: true, 
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
            if(value.toLowerCase().match(/password/)){
                throw new Error('Password can not contain password');
            }
        }
    },
    tokens: [
        {
            token: {
                type: String,
                required: true
            }
        }
    ],
    avatar:{
        type:Buffer
    }
},{
    timestamps: true
})

userSchema.virtual('tasks', {
    ref: 'Task',
    localField: '_id',
    foreignField: 'owner'
})

userSchema.methods.generateToken = async function(){
    const user = this;
    const token = jwt.sign({_id: user._id.toString()}, 'newcourse');

    user.tokens = user.tokens.concat({token});
    await user.save();

    return token;
}

userSchema.methods.toJSON = function(){

    const user = this;
    const userPublic = user.toObject();

    delete userPublic.password;
    delete userPublic.tokens;
    delete userPublic.__v;
    delete userPublic.avatar

    return userPublic;
}

userSchema.statics.findByCredentials = async (email, password) =>{

    const user = await User.findOne({email})
    
    if(!user){
        throw new Error('Unable to login');
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if(!isMatch){
        throw new Error('Unable to login');
    }

    return user;
}

// Hash the password before saving
userSchema.pre('save', async function (next){
    const user = this;

    if(user.isModified('password')){
        user.password = await bcrypt.hash(user.password, 8);
    }

    next();
})

userSchema.pre('remove', async function(next){
    
    const user = this;

    await Task.deleteMany({owner: user._id});
    next();
})

const User = mongoose.model('User', userSchema)


module.exports = User;