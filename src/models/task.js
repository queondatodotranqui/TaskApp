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
            required: true
        }
    },{
        timestamps: true
    }
);

const Task = mongoose.model('task', taskSchema);

module.exports = Task;