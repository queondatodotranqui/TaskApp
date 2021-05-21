const mongoose = require('mongoose');

const Task = mongoose.model('task',
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
            type:mongoose.Schema.Types.ObjectId,
            required: true
        }
    }
)

module.exports = Task;