const mongoose = require('mongoose');
const { Schema } = require('mongoose');

const taskSchema = new Schema(
    {
        description:{
            type: String,
            required: true
        },
        completed:{
            type: Boolean,
            default: false
        },
        owner:{
            type:Schema.Types.ObjectId,
            required: true,
            ref: 'User'
        }
    },{
        timestamps: true
    }
);

const Task = mongoose.model('Task', taskSchema);

module.exports = Task;