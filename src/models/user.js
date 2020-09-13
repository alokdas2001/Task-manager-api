const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')
var jwt = require('jsonwebtoken');
const Task = require('./task')

const userSchema = new mongoose.Schema({  // User is the name of db
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        unique:true,
        required: true,
        trim: true, // remove blank space
        lowercase: true,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error('Email is invalid')
            }
        }
    },
    password: { 
        type: String,
        required: true,
        minlength: 7,
        trim: true,
        validate(value) {
            if (value.toLowerCase().includes('password')) {
                throw new Error('Password cannot contain "password"')
            }
        }
    },
    age: {
        type: Number,
        default: 0,
        validate(value) {
            if (value < 0) {
                throw new Error('Age must be a postive number')
            }
        }
    },
    tokens:[{
        token:{
            type:String,
            required: true
        }
    }], 
    avatar:{
        type:Buffer
    }
}, {
       timestamps:true  // time of creating and updating  
})

// saving task by user id
userSchema.virtual('tasks' , {
ref:'Task', 
localField: '_id', // local data is stored
foreignField:'owner' // name of the field
})

// remove things from login page
userSchema.methods.toJSON = function(){
    const user = this 

    const userObject = user.toObject()

    delete userObject.password  // removing displaying of  password from  pages
    delete userObject.tokens    // removing displaying of  tokens from  pages
    delete userObject.avatar // removing displaying of  avatar in binary form from  pages

    return userObject
}

// generate Auth Token
userSchema.methods.generateAuthToken = async function(){
    const user = this
    const token = jwt.sign({_id:user.id.toString()} ,JWT_SECRET)  // name nodejscourse can be anything..it is like secret key

    user.tokens = user.tokens.concat({token}) // displaying token
    await user.save()
    return token
}


// User login 
userSchema.statics.findUser = async (email , password) =>{

    const user = await User.findOne({email})    

    if(!user){
        throw new Error('unable to login')
    }   

    const isMatch = await bcrypt.compare(password , user.password) // one typed and another stored in db

    if(!isMatch){
        throw new Error('unable to login')
    }   

    return user
}


// hashing plain text password
userSchema.pre('save' , async function (next) {
    const user = this

    if(user.isModified('password')){  // checking if the password is modified or not
        user.password = await bcrypt.hash(user.password , 8)  // hashing the password 
    }
    next()
})

// Delete user task when user is removed
userSchema.pre('remove' , async function (next){
    const user = this 
    await Task.deleteMany({owner : user._id})
    next()
})

const User = mongoose.model('User' , userSchema)

module.exports = User
