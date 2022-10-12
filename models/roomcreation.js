const mongoose = require('mongoose')
const UserSchema= new mongoose.Schema(


    { 
        roomID:{
            type:String,
            required: true
        }, 
        price:{
            type:mongoose.Types.Decimal128,
            required: true
        },
        promotionalCode: { 
            type:String
        }, 
        roomCapacity: { 
            type:Number,
            required: true
        }, 
        openingDate: { 
            type:Date,
            required: true
        }, 
        closingDate: { 
            type:Date,
            required: true
        }, 
        createdBy: { 
            type:String
        }, bookedBy: { 
            type:String
        }, launchStatus: { 
            type:String
        }, 
        date: {
            type:Date,
            required: true,
            default: Date.now,
        }, 
        
    
    })

    //createmodel ingular name of the collection your model is for.

    const rooms = mongoose.model('rooms',UserSchema)

    module.exports = rooms