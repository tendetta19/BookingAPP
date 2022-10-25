const mongoose = require('mongoose')
const UserSchema= new mongoose.Schema(


    {
        roomID:{
            type:String,
            required: true
        },
        Date:{
            type:String,
            required: true
        },
        Timeslot:{
            type:String,
            required: true
        },
        BookedBy: {
            type:String,
            required: true
        },
        role: {
            type:String,
            required: true
        },
        PaymentStatus: {
            type:String,
       
        },
 
    })

    //createmodel ingular name of the collection your model is for.

    const bookings = mongoose.model('bookings',UserSchema)

    module.exports = bookings
