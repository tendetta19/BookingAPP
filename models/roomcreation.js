const mongoose = require('mongoose')
const UserSchema= new mongoose.Schema(


    { 
        roomID:{
            type:String,
            required: true
        }, 
        price:{
            type:String,
            required: true
        },
        promotionalCode: { 
            type:String
        }, 
        roomCapacity: { 
            type:Number,
            required: true
        }, 
        timeslot: { 
            type:String, 
        }, 
        createdBy: { 
            type:String
        }, bookedBy: { 
            type:String
        }, launchStatus: { 
            type:String
        },  launchstartdate: { 
            type:String
        },  launchenddate: { 
            type:String
        }, timerange: { 
            type:String,
            required: true
        }, timeslots: {            
            type:Array
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