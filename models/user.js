const mongoose = require('mongoose')
const UserSchema= new mongoose.Schema(


    { 
        fullname:{
            type:String,
            required: true
        },
        studentID:{
            type:String,
            required: true,
            unique:false
        },
        email:{
            type:String,
            required: true
        },
        hashedpassword: { 
            type:String,
            required: true
        }, 
        role: { 
            type:String,
            required: true
        }, 
        date: {
            type:Date,
            required: true,
            default: Date.now,
        }
    
    })

    //createmodel ingular name of the collection your model is for.

    const User = mongoose.model('User',UserSchema)

    module.exports = User