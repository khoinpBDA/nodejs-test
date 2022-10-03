const mongoose = require('mongoose')

const validator = require('validator')


const taskSchema = new mongoose.Schema({
    description: {
        type: String
    },
    completed: {
        type: Boolean
    },
    owner: {
        required: true,
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
}, {
    timestamps: true,
    // toObject: true, uncomment this will cause 400 bad rq
    toJSON: {virtuals: true}
})

taskSchema.methods.toJSON = function(){
    const {id, ...taskObject} = this.toObject()
    return taskObject
}

const Task = mongoose.model('Task', taskSchema)

module.exports = Task
