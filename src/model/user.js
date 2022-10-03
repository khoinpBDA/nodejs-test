const mongoose = require('mongoose')

const validator = require('validator')

const bcrypt = require('bcryptjs')

const jwt = require('jsonwebtoken')

const Task = require('../model/task')

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        index: true,
        trim: true,
        lowercase: true,
        async validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error('Email is invalid')
            }
            const count = await mongoose.models.User.countDocuments({ email: value });
            if (count > 0) {
                const existing = await mongoose.models.User.findOne({ email: value });
                if (!(existing._id.toString() === this._id.toString())) {
                    throw new Error("Email not unique");
                }
            }
        }
    },
    password: {
        type: String,
        required: true,
        trim: true,
        minlength: 7,
        validate(value) {
            if (value.toLowerCase().includes('password')) {
                throw new Error('Must not contain password')
            }
        }
    },
    age: {
        type: Number,
        default: 0,
        validate(value) {
            if (value < 0) {
                throw new Error('Value must be greater than 0')
            }
        }
    },
    tokens:[
        {
            token:{
                type: String,
                // required: true
            }
        }
    ],
    avatar: {
        type: Buffer
    }
},
{
    timestamps: true,
    autoCreate: true,
    autoIndex: true,
    toJSON: {virtuals: true},
    toObject: {virtuals: true}
})

userSchema.index({ email: 1 })

userSchema.virtual('tasks', {
    ref: 'Task',
    localField: '_id',
    foreignField: 'owner'
})

userSchema.methods.toJSON = function(){
    const {tokens,password,id,avatar, ...userObject} = this.toObject()
    return userObject
}

userSchema.methods.generateAuthToken = async function(){
    const user = this
    const token = jwt.sign({_id: user._id.toString()}, process.env.JWT_SECRET)
    user.tokens = user.tokens.concat({token})
    await user.save()
    return token
}

userSchema.statics.findByCredentials = async (email, password) => {
    const user = await User.findOne({ email })

    if (!user) {
        throw new Error('Unable to login')
    }

    const isMatch = bcrypt.compare(password, user.password)

    if (!isMatch) {
        throw new Error('Unable to login')
    }

    return user
}

userSchema.pre('save', async function (next) {
    const user = this
    if (user.isModified('password')) {
        user.password = await bcrypt.hash(user.password, 10)
    }
    next()
})

userSchema.pre('remove', async function (next) {
    const user = this
    await Task.deleteMany({owner: user._id})
    next()
})

const User = mongoose.model('User', userSchema)


module.exports = User