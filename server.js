//indevelopment
//taskkill /f /im node.exe boomnodejs
if (process.env.NODE_ENV !== 'production') {
    //Loading your environment variables is a one-liner:
    require('dotenv').config()
}
const datejs =require('datejs')
const {ensureAuthenticated} = require('./config/auth')
const flash = require('connect-flash')
const session = require('express-session')
const mongoose = require('mongoose')
const _ = require('lodash');
const express = require('express')
const app = express()
const bcrypt = require(`bcrypt`)
const methodOverride = require('method-override')
app.use(express.static("views"))
//set port ${PORT} <-- calls from variable (must use ` `)
const PORT = process.env.PORT || 3000;
const User= require('./models/user.js')
const bookings= require('./models/bookings.js')
const rooms= require('./models/roomcreation.js')
const passport= require('passport')
require('./config/passport')(passport)
app.use(express.urlencoded({ extended:false}))
app.use(session({
    secret: process.env.SESSION_SECRET ,
    resave: true,
    saveUninitialized: true
  }))

  //connect flash

  app.use(flash())
//Passport middleware
app.use(passport.initialize())
app.use(passport.session())


  app.use((req,res,next) =>{
    res.locals.success_msg = req.flash('success_msg')
    res.locals.error_msg = req.flash('error_msg')
    res.locals.error = req.flash('error')
    next()





  })


//keys
const db = process.env.CONNECTIONSTRING

//connect to Mongo (returns a promise)The Promise object represents the eventual completion (or failure) of an asynchronous operation and its resulting value.
mongoose.connect(db, { useNewURLParser: true })
//successfulcallback
    .then(()=> console.log('MongoDB connected'))
    .catch(err => console.log(err))

app.listen(PORT, console.log( `Server started on port ${PORT}`));
app.set('view engine', 'ejs')

app.get('/', (req, res) => {
    console.log('Home page loaded')
    res.render('./user/index')
})

app.post('/',  async (req, res, next) => {
    const {userID, password} = req.body

    const lastlogin= new Date().toLocaleString("en-US", {timeZone: "Asia/Singapore"})
const authlevel = []

    User.findOne({
        userID: userID


    },
    ).then(user => {
        if(user){

            User.findOneAndUpdate({userID: user.userID},{lastlogin: lastlogin})
            .then(user => {
                console.log("Last login updated to "+ lastlogin)
            })
            .catch(err => console.log(err));


        authlevel.push('/'+user.role+"Dash")}

        }




)

    passport.authenticate('local', {
    successRedirect:authlevel,
    failureRedirect:'/',
    failureFlash:true
})


(req,res,next)
delete authlevel


})

app.get('/forgetpassword',  (req, res) => {


    res.render("./user/forgetpassword")


})

app.get('/register',  (req, res) => {


    res.render("./user/register")


})
app.get('/staffDash',ensureAuthenticated,   (req, res) => {

    role=req.user.role
    if(role === 'admin'){
        res.redirect('/adminDash')
    }if(role === 'student'){
        res.redirect('/studentDash')
    }
    if(role === 'staff'){

    res.render("./user/staff/staffDash", {
        name:req.user.fullname


    })


}})
app.get('/studentDash',ensureAuthenticated,   (req, res) => {

    role=req.user.role
    if(role === 'admin'){
        res.redirect('/adminDash')
    }if(role === 'staff'){
        res.redirect('/staffDash')
    }
    if(role === 'student'){

    res.render("./user/student/studentDash", {
        name:req.user.fullname


    })


}})
app.get('/bookaroom',ensureAuthenticated,   (req, res) => {

  role=req.user.role
  if(role === 'admin'){
      res.redirect('/adminDash')
  }if(role === 'staff'){
      res.redirect('/staffDash')
  }
  if(role === 'student'){
const todaysdate  = new Date().toISOString().slice(0, 10)
console.log(todaysdate)
      rooms.find({}, {roomID:1, launchstartdate:1, launchenddate:1, roomCapacity:1, timeslots:1, price:1, promotionalCode:1, _id:0}, function(err, roomIDs){
          roomIDs1 = roomIDs
          bobt = roomIDs.length
      bookings.find({}, {roomID:1, Timeslot:1, Date:1, _id:0, }, function(err, bookingss){
        booking1 = bookingss


    res.render("./user/student/bookaroom", {
      name:req.user.fullname,
        c:1,
        d:todaysdate,
        e:todaysdate,




    })
})
})

}})
app.get('/payment',  (req, res) => {

    role=req.user.role

    res.render("./user/student/payment", {
name:req.user.fullname

    })


})
app.get('/adminDash',ensureAuthenticated,   (req, res) => {
role=req.user.role
if(role === 'staff'){
    res.redirect('/staffDash')
}if(role === 'student'){
    res.redirect('/studentDash')
}
if(role === 'admin'){

    res.render("./user/admin/adminDash", {
        name:req.user.fullname


    })


}})
app.get('/viewbooking', (req, res) => {
    res.render('./user/student/viewbooking', {
        name:req.user.fullname


    })


})
app.get('/paymentsuccess',ensureAuthenticated,  (req, res) => { role=req.user.role
    if(role === 'admin'){
        res.redirect('/adminDash')
    }if(role === 'staff'){
        res.redirect('/staffDash')
    }
    if(role === 'student'){
    res.render("./user/student/paymentsuccess", {
        name:req.user.fullname,



    },

    )





}})
app.get('/modifysuccess',ensureAuthenticated,  (req, res) => { role=req.user.role
    if(role === 'admin'){
        res.redirect('/adminDash')
    }if(role === 'staff'){
        res.redirect('/staffDash')
    }
    if(role === 'student'){
    res.render("./user/student/modifysuccess", {
        name:req.user.fullname,



    },

    )





}})
app.get('/bookingdata',ensureAuthenticated,  (req, res) => {

    const name= req.user.userID
  //not protected for now
    bookings.find({BookedBy: name}, function(err, booking) {
        Bookingslist = booking

        res.json({
            "data": Bookingslist
          })


    }
    )





})
app.get('/timeslotdata',ensureAuthenticated,  (req, res) => {

    const name= req.user.fullname
  //not protected for now
    bookings.find({createdBy: name}, function(err, booking) {
        Bookingslist = booking

        res.json({
            "data": Bookingslist
          })


    }
    )





})
app.get('/createroom',ensureAuthenticated,   (req, res) => {

const todaysdate  = new Date().toISOString().slice(0, 10)
    role=req.user.role
    if(role === 'admin'){
        res.redirect('/adminDash')
    }if(role === 'student'){
        res.redirect('/studentDash')
    }
    if(role === 'staff'){

    res.render("./user/staff/createroom", {
        name:req.user.fullname,
        d:todaysdate


    })


}})
app.get('/editroom',ensureAuthenticated,   (req, res) => {

    const todaysdate  = new Date().toISOString().slice(0, 10)
    role=req.user.role
    if(role === 'admin'){
        res.redirect('/adminDash')
    }if(role === 'student'){
        res.redirect('/studentDash')
    }
    if(role === 'staff'){
    res.render("./user/staff/editroom", {
        name:req.user.fullname,

        d:todaysdate


    })


}})
app.get('/createaccount',ensureAuthenticated,  (req, res) => {

    role=req.user.role
    if(role === 'staff'){
        res.redirect('/staffDash')
    }if(role === 'student'){
        res.redirect('/studentDash')
    }
    if(role === 'admin'){
    res.render("./user/admin/createaccount", {
        name:req.user.fullname


    })


}})
app.get('/editaccount',ensureAuthenticated,  (req, res) => {
    role=req.user.role
    if(role === 'staff'){
        res.redirect('/staffDash')
    }if(role === 'student'){
        res.redirect('/studentDash')
    }
    if(role === 'admin'){
    res.render("./user/admin/editaccount", {
      name:req.user.fullname


  })


}})
app.get('/student',ensureAuthenticated,  (req, res) => {

    role=req.user.role
    if(role === 'admin'){
        res.redirect('/adminDash')
    }if(role === 'staff'){
        res.redirect('/staffDash')
    }
    if(role === 'student'){

    res.render("./user/student/student", {
        name:req.user.fullname,


    })


}})
app.get('/roomData',ensureAuthenticated,  (req, res) => {
    rooms.find({}, function(err, room) {
        roomsList = room

        res.json({
            "data": roomsList
          })


    }
    )





})

app.get('/userData',ensureAuthenticated,  (req, res) => {
    role=req.user.role
    if(role === 'staff'){
        res.redirect('/staffDash')
    }
    if(role === 'student'){
        res.redirect('/studentDash')
    }
    if(role === 'admin'){
    User.find({}, function(err, user) {
        Userslist = user

        res.json({
            "data": Userslist
          })


    }
    )





}})


app.get('/staff',ensureAuthenticated,  (req, res) => { role=req.user.role
    if(role === 'admin'){
        res.redirect('/adminDash')
    }if(role === 'student'){
        res.redirect('/studentDash')
    }
    if(role === 'staff'){
    res.render("./user/staff/staff", {
        name:req.user.fullname,



    },

    )





}})
// bodyParser get data from form express.urlencoded() is a method inbuilt in express to recognize the incoming Request Object as strings or array


/*Forces the session to be saved back to the session store, even if the session was never modified during the request. Depending on your store this may be necessary, but it can also create race conditions where a client makes two parallel requests to your server and changes made to the session in one request may get overwritten when the other request ends, even if it made no changes (this behavior also depends on what store you're using).

The default value is true, but using the default has been deprecated, as the default will change in the future. Please research into this setting and choose what is appropriate to your use-case. Typically, you'll want false.

How do I know if this is necessary for my store? The best way to know is to check with your store if it implements the touch method. If it does, then you can safely set resave: false. If it does not implement the touch method and your store sets an expiration date on stored sessions, then you likely need resave: true. */
//forgetpassword










app.get('/logout', (req, res) => {
    const lastlogout= new Date().toLocaleString("en-US", {timeZone: "Asia/Singapore"})
    userID= req.user.userID
    User.findOne({
        userID: userID



    },
    ).then(user => {
        if(user){
            User.findOneAndUpdate({userID: user.userID},{lastlogout: lastlogout})
            .then(user => {
                console.log("Last logout updated to "+ lastlogout)
            })
            .catch(err => console.log(err));



        }}




)
    req.logout(err => {
        req.flash('success_msg', 'You are logged out');
        res.redirect('/');
    });

  });
app.post('/forgetpassword',  async (req, res) => {
    const {userID, password, confirmPassword} = req.body
    const hashedpassword = await bcrypt.hash(req.body.password, 10)
    let errors = []
    if (password != confirmPassword){
        errors.push({ msg: "Passwords must be the same"})
    }
    if(errors.length > 0){
        res.render('./user/forgetpassword', {
            errors,

        })
    } else{
        User.findOne({
            userID: userID


        },
        )

        .then(user => {
            if(!user){
                errors.push({msg: 'There is no user with that ID'})
                // User exists
                res.render('./user/forgetpassword', {
                    errors,

                })
            }
                else  {
               User.findOneAndUpdate({userID: user.userID},{hashedpassword: hashedpassword})
                .then(user => {
                        req.flash(
                        'success_msg',
                        'Password reset!'
                        );
                        res.redirect('/');
                    })
                    .catch(err => console.log(err));





            }
        }


)}})
const selectDate= ''
const todaysdate  = new Date().toISOString().slice(0, 10)
const selectCapacity= ''
app.post('/bookaroom',  async (req, res) => {
    const {selectDate, selectCapacity} = req.body

    res.render("./user/student/bookaroom", {
        d:selectDate,
        c:selectCapacity,
        e:todaysdate,
        name:req.user.fullname




    })})

    app.post('/payment',  async (req, res) => {
        const {roomID, Date, Timeslot} = req.body
        const name = req.user.userID
        const role = req.user.role
        const PaymentStatus = ""


          createdBy2 = await rooms.find({roomID:roomID}, {createdBy:1});

          var createdBy = createdBy2.toString().substring(createdBy2.toString().lastIndexOf(":")+3,createdBy2.toString().lastIndexOf('\''))



        let errors = []

    	const BookedBy = name

        if(errors.length > 0){
            res.render('./user/student/payment', {
                errors,
                name:req.user.fullname

            })
        }  else  {
                        const newBooking = new bookings({
                            roomID,
                            Date,
                            Timeslot,
                            BookedBy,
                            role,
                            PaymentStatus,
                            createdBy
                        })
                        newBooking
                            .save()
                            .then(user => {
                                req.flash(
                                'success_msg',
                                'Room Booked!'
                                );
                                res.redirect('/paymentsuccess');
                            })
                            .catch(err => console.log(err));

                    }

              }






    )
    app.post('/viewbooking',  async (req, res) => {
        const {selectDate, selectRoomID, selectTimeslot, cancelBooking} = req.body

        rooms.find({}, {roomID:1, roomCapacity:1, timeslots:1, price:1, promotionalCode:1, _id:0}, function(err, roomIDs){
            roomIDs1 = roomIDs
            bobt = roomIDs.length
        bookings.find({}, {roomID:1, Timeslot:1, Date:1, _id:0, }, function(err, bookingss){
          booking1 = bookingss

          if (cancelBooking === "false"){

        res.render("./user/student/editbooking", {
            d:selectDate,
            r:selectRoomID,
            t:selectTimeslot,
            name:req.user.fullname,

})} else{
  bookings.findOneAndDelete({roomID: selectRoomID, Date: selectDate, Timeslot: selectTimeslot})

  .then(user => {
      req.flash(
      'success_msg',
      'Booking cancelled!'
      );
      res.redirect('/viewbooking');

})}


})



        })})
        app.post('/editbooking',  async (req, res) => {
            const {selectDate, selectRoomID, selectTimeslot, newTimeslot, editBooking} = req.body
            console.log(selectDate, selectRoomID, selectTimeslot, newTimeslot, editBooking)
            let errors = []

            if(errors.length > 0){
                res.render('./user/student/editbooking', {
                    errors,
                    name:req.user.fullname

                })
            } else{
              if(editBooking==='true'){
                bookings.findOneAndUpdate({roomID: selectRoomID, Date: selectDate, Timeslot: selectTimeslot},
                  {roomID: selectRoomID, Date: selectDate, Timeslot: newTimeslot}

                )





                     .then(user => {
                             req.flash(
                             'success_msg',
                             'Booking updated!'
                             );
                             res.redirect('/modifysuccess');
                         })
                         .catch(err => console.log(err));
                       }
}
                     }


                //validation passed





        )


app.post('/register',  async (req, res) => {
    const hashedpassword = await bcrypt.hash(req.body.password, 10)
    const {fullname, userID, email, password, confirmPassword, role} = req.body
    const lastlogin = 'hi'
    const lastlogout = 'hi'
    const noWhitespacelength = /^(?=.*\s)/;
    const pwLength= /^.{5,16}$/;
    /* ^ matches the start of the string.
[A-Za-z]* matches 0 or more letters (case-insensitive) -- replace * with + to require 1 or more letters.
, matches a comma followed by a space.
$ matches the end of the string, so if there's anything after the comma and space then the match will fail.*/
    const noLetters = /^[A-Za-z]*, $/
    let errors = []
    const fullnamecheck = /^([^0-9]*)$/
    const IDcheck = /^.{7,7}$/

    if (!fullnamecheck.test(fullname)){
        errors.push({ msg: "Please do not include any numbers in your name"})
    }
    if (fullnamecheck.test(userID)){
        errors.push({ msg: "Please only include numbers in your Student ID"})
    }  if (!IDcheck.test(userID)){
        errors.push({ msg: "Please ensure your Student ID is 7 numbers long"})
    }
   if (noWhitespacelength.test(password)){
        errors.push({ msg: "Password must not contain any white spaces"})
    }
    if (!pwLength.test(password)){
        errors.push({ msg: "Password must be 5 Characters Long"})
    }
    if (password != confirmPassword){
        errors.push({ msg: "Passwords must be the same"})
    }

    /*if(password.length < 6){
         errors.push({ msg: "Password should at least be 6 characters long"})
}*/
    if(errors.length > 0){
        res.render('./user/register', {
            errors,

        })
    } else{
        /* Checks if there is any email in the database that is the same as the post request
            If User.findone returns a result (e.g user), person is already in DB and it'll push an error
            If it does not return anything (i.e user doesnt exist), use mongomodel to push a new user
        */
        User.findOne({
            userID: userID


        ,
            email:email
        })

        .then(user => {
            if(user){
                errors.push({msg: 'Student ID/Email is already in use'})
                // User exists
                res.render('./user/register', {
                    errors,

                })
            }
                else  {
                    //Push since user doesnt exist model to create new user
                    const newUser = new User({
                        fullname,
                        userID,
                        email,
                        hashedpassword,
                        role,
                        lastlogin,
                        lastlogout


                    })
                    newUser
                        .save()
                        .then(user => {
                            req.flash(
                            'success_msg',
                            'Account created!'
                            );
                            res.redirect('/');
                        })
                        .catch(err => console.log(err));

                }

            }


        //validation passed





)}})



app.post('/createaccount',  async (req, res) => {
    const hashedpassword = await bcrypt.hash(req.body.password, 10)
    const {fullname, userID, email, password, confirmPassword, role} = req.body
    const lastlogin = ''
    const lastlogout = ''
    const noWhitespacelength = /^(?=.*\s)/;
    const pwLength= /^.{5,16}$/;
    /* ^ matches the start of the string.
[A-Za-z]* matches 0 or more letters (case-insensitive) -- replace * with + to require 1 or more letters.
, matches a comma followed by a space.
$ matches the end of the string, so if there's anything after the comma and space then the match will fail.*/
    const noLetters = /^[A-Za-z]*, $/
    let errors = []
    const fullnamecheck = /^([^0-9]*)$/
    const IDcheck = /^.{7,7}$/

    if (!fullnamecheck.test(fullname)){
        errors.push({ msg: "Please do not include any numbers in your name"})
    }
    if (fullnamecheck.test(userID)){
        errors.push({ msg: "Please only include numbers in your Student ID"})
    }  if (!IDcheck.test(userID)){
        errors.push({ msg: "Please ensure your Student ID is 7 numbers long"})
    }
   if (noWhitespacelength.test(password)){
        errors.push({ msg: "Password must not contain any white spaces"})
    }
    if (!pwLength.test(password)){
        errors.push({ msg: "Password must be 5 Characters Long"})
    }
    if (password != confirmPassword){
        errors.push({ msg: "Passwords must be the same"})
    }

    /*if(password.length < 6){
         errors.push({ msg: "Password should at least be 6 characters long"})
}*/
    if(errors.length > 0){
        res.render('./user/admin/createaccount', {
            errors,

        })
    } else{
        /* Checks if there is any email in the database that is the same as the post request
            If User.findone returns a result (e.g user), person is already in DB and it'll push an error
            If it does not return anything (i.e user doesnt exist), use mongomodel to push a new user
        */
        User.findOne({
            userID: userID


        ,
            email:email
        })

        .then(user => {
            if(user){
                errors.push({msg: 'Student ID/Email is already in use'})
                // User exists
                res.render('./user/admin/createaccount', {
                    errors,

                })
            }
                else  {
                    //Push since user doesnt exist model to create new user
                    const newUser = new User({
                        fullname,
                        userID,
                        email,
                        hashedpassword,
                        role,
                        lastlogin,
                        lastlogout


                    })
                    newUser
                        .save()
                        .then(user => {
                            req.flash(
                            'success_msg',
                            'Account created!'
                            );
                            res.redirect('/adminDash');
                        })
                        .catch(err => console.log(err));

                }

            }


        //validation passed





)}})

app.post('/editaccount',  async (req, res) => {
    const {fullname, userID, email, role,deleteAccount} = req.body
    const noWhitespacelength = /^(?=.*\s)/;
    /* ^ matches the start of the string.
[A-Za-z]* matches 0 or more letters (case-insensitive) -- replace * with + to require 1 or more letters.
, matches a comma followed by a space.
$ matches the end of the string, so if there's anything after the comma and space then the match will fail.*/
    const noLetters = /^[A-Za-z]*, $/
    let errors = []
    const fullnamecheck = /^([^0-9]*)$/

    if (!fullnamecheck.test(fullname)){
        errors.push({ msg: "Please do not include any numbers in your name"})
    }

    if(errors.length > 0){
        res.render('./user/admin/editaccount', {
            errors,
            name:req.user.fullname

        })
    } else{
      if(deleteAccount==='true'){
        User.findOne({
          userID: userID

        })
        .then(user => {
            if(!user){
                errors.push({msg: 'User ID does not exist!'})

                res.render('./user/admin/editaccount', {
                    errors,
                    name:req.user.fullname

                })
            }
            else {
              User.deleteMany({userID: user.userID},
            )
            .then(user => {
                    req.flash(
                    'success_msg',
                    'Room deleted!'
                    );
                    res.redirect('/adminDash');
                })
                .catch(err => console.log(err));

              }
            })
          }else{
        /* Checks if there is any email in the database that is the same as the post request
            If User.findone returns a result (e.g user), person is already in DB and it'll push an error
            If it does not return anything (i.e user doesnt exist), use mongomodel to push a new user
        */
        User.findOne({
            userID: userID



      })

        .then(user => {
            if(!user){
                errors.push({msg: 'WTF'})
                // User exists
                res.render('./user/admin/editaccount', {
                    errors,

                })
            }
              else {
                User.findOneAndUpdate({userID: user.userID},
                  {fullname: fullname,
                  role: role,
                  email: email

                })
             .then(user => {
                     req.flash(
                     'success_msg',
                     'Account updated!'
                     );
                     res.redirect('/adminDash');
                 })
                 .catch(err => console.log(err));
               }

             }


        //validation passed





)}}})


app.post('/createroom',  async (req, res) => {
   // console.log(name)
    const {unit,level,block, price, roomCapacity, promotionalCode, launchStatus,launchstartdate,launchenddate,openinghour,closinghour} = req.body
    const roomID= 'BLK '+block+' '+'L-'+level+'-'+ unit.toUpperCase()


    const timeslot = ''
    const name = req.user.fullname
    let errors = []
	// const createdBy = name
	const bookedBy = ''
	const createdBy = name
     /* ^ matches the start of the string.
[A-Za-z]* matches 0 or more letters (case-insensitive) -- replace * with + to require 1 or more letters.
, matches a comma followed by a space.
$ matches the end of the string, so if there's anything after the comma and space then the match will fail.*/
const timecheck = /[0][0]$/
const pricecheck  = /^[1-9][\.\d]*(,\d+)?$/
if (!pricecheck.test(price)){
        errors.push({ msg: "Please enter a valid price"})
    }
if (launchStatus==='true' && !timecheck.test(openinghour) && !timecheck.test(closinghour)){
        errors.push({ msg: "Please enter a valid time ending with :00"})
    }


    if(errors.length > 0){
        res.render('./user/staff/createroom', {
            errors,
            name:req.user.fullname

        })
    } else{
        const timerange= (openinghour+' - '+ closinghour)
        const timesplit =  String(closinghour).slice(0, 2)- String(openinghour).slice(0, 2)
        const timeslots =[]

        for (let i = 1; i <= timesplit; i++) {
            upperlimit= parseFloat(String(openinghour).slice(0,2))+ parseFloat(i-1)+":00"
            lowerlimit= parseFloat(String(openinghour).slice(0, 2)) + parseFloat(i) +":00"
            finaltimeslot= "{"+ i+": "+upperlimit +'-'+lowerlimit+"}"
            timeslots.push(finaltimeslot);

          }
        /* Checks if there is any email in the database that is the same as the post request
            If User.findone returns a result (e.g user), person is already in DB and it'll push an error
            If it does not return anything (i.e user doesnt exist), use mongomodel to push a new user
        */
        rooms.findOne({
            roomID: roomID


        } )

        .then(user => {
            if(user){
                errors.push({msg: 'Room ID already exists!'})

                res.render('./user/staff/createroom', {
                    errors,
                    name:req.user.fullname

                })
            }
                else  {
                    //Push since user doesnt exist model to create new user
                    const newRoom = new rooms({
                        roomID,
                        roomCapacity,
                        price,
                        timeslot,
						promotionalCode,
						createdBy,
						bookedBy,
						launchStatus,
                        launchstartdate,
                        launchenddate,
                        timerange,
                        timeslots




                    })
                    newRoom
                        .save()
                        .then(user => {
                            req.flash(
                            'success_msg',
                            'Booking created! Launch your room to make it available for booking!'
                            );
                            res.redirect('/createRoom');
                        })
                        .catch(err => console.log(err));

                }

            }






)}})

app.post('/deleteroom',  async (req, res) => {
    // console.log(name)
    let {roomID, price, roomCapacity, promotionalCode, launchStatus,launchstartdate,launchenddate,deleteroom} = req.body

     const timeslot = ''
     const name = req.user.fullname
     let errors = []
     // const createdBy = name
     const bookedBy = ''
     const createdBy = name
      /* ^ matches the start of the string.
 [A-Za-z]* matches 0 or more letters (case-insensitive) -- replace * with + to require 1 or more letters.
 , matches a comma followed by a space.
 $ matches the end of the string, so if there's anything after the comma and space then the match will fail.*/
 const pricecheck  = /^[1-9][\.\d]*(,\d+)?$/
 if (!pricecheck.test(price)){
         errors.push({ msg: "Please enter a valid price"})
     }

if (launchstartdate>launchenddate){
        errors.push({ msg: "Please ensure your launch end date is after your launch start date"})
    }


     if(errors.length > 0){
         res.render('./user/staff/deleteroom', {
             errors,
             name:req.user.fullname

         })
     } else{
        if(deleteroom==='true'){
            rooms.findOne({
                roomID: roomID,

               createdBy: name


            })
            .then(user => {
                if(!user){
                    errors.push({msg: 'Room ID does not exist! Make sure you are the owner of this room'})

                    res.render('./user/staff/editroom', {
                        errors,
                        name:req.user.fullname

                    })
                }
                else  {
                   rooms.deleteMany({roomID: user.roomID},






                       )
                    .then(user => {
                            req.flash(
                            'success_msg',
                            'Room deleted!'
                            );
                            res.redirect('/staff');
                        })
                        .catch(err => console.log(err));





                }

                })


        }}})


        app.post('/editroom',  async (req, res) => {
            // console.log(name)
            let {unit,level,block, price, roomCapacity, promotionalCode, launchStatus,launchstartdate,launchenddate,deleteroom,openinghour,closinghour} = req.body
            const roomID= 'BLK '+block+' '+'L-'+level+'-'+ unit.toUpperCase()
             const timeslot = ''
             const name = req.user.fullname
             let errors = []
             // const createdBy = name
             const bookedBy = ''
             const createdBy = name
             const timecheck = /[0][0]$/
              /* ^ matches the start of the string.
         [A-Za-z]* matches 0 or more letters (case-insensitive) -- replace * with + to require 1 or more letters.
         , matches a comma followed by a space.
         $ matches the end of the string, so if there's anything after the comma and space then the match will fail.*/
         const pricecheck  = /^[1-9][\.\d]*(,\d+)?$/
         if (!pricecheck.test(price)){
                 errors.push({ msg: "Please enter a valid price"})
             }
             if (launchStatus==='true' && !timecheck.test(openinghour) && !timecheck.test(closinghour)){
                errors.push({ msg: "Please enter a valid time ending with :00"})
            }

        if (launchstartdate>launchenddate){
                errors.push({ msg: "Please ensure your launch end date is after your launch start date"})
            }


             if(errors.length > 0){
                 res.render('./user/staff/editroom', {
                     errors,
                     name:req.user.fullname

                 })
             } else{
                if(deleteroom==='true'){
                    rooms.findOne({
                        roomID: roomID,

                       createdBy: name


                    })
                    .then(user => {
                        if(!user){
                            errors.push({msg: 'Room ID does not exist! Make sure you are the owner of this room'})

                            res.render('./user/staff/editroom', {
                                errors,
                                name:req.user.fullname

                            })
                        }
                        else  {
                           rooms.deleteMany({roomID: user.roomID},






                               )
                            .then(user => {
                                    req.flash(
                                    'success_msg',
                                    'Room deleted!'
                                    );
                                    res.redirect('/staff');
                                })
                                .catch(err => console.log(err));





                        }

                        })


                }else{

                    const timerange= (openinghour+' - '+ closinghour)
                    const timesplit =  String(closinghour).slice(0, 2)- String(openinghour).slice(0, 2)
                    const timeslots =[]

                    for (let i = 1; i <= timesplit; i++) {
                        upperlimit= parseFloat(String(openinghour).slice(0,2))+ parseFloat(i-1)+":00"
                        lowerlimit= parseFloat(String(openinghour).slice(0, 2)) + parseFloat(i) +":00"
                        finaltimeslot= "{"+ i+": "+upperlimit +'-'+lowerlimit+"}"
                        timeslots.push(finaltimeslot);

                      }
                 /* Checks if there is any email in the database that is the same as the post request
                     If User.findone returns a result (e.g user), person is already in DB and it'll push an error
                     If it does not return anything (i.e user doesnt exist), use mongomodel to push a new user
                 */
                 rooms.findOne({
                     roomID: roomID,

                    createdBy: name
                })

                 .then(user => {
                     if(!user){
                         errors.push({msg: 'Room ID does not exist! Make sure you are the owner of this room'})

                         res.render('./user/staff/editroom', {
                             errors,
                             name:req.user.fullname

                         })
                     }
                     else  {
                        rooms.findOneAndUpdate({roomID: user.roomID},
                            {price: price,
                            roomCapacity: roomCapacity,
                            promotionalCode: promotionalCode,
                            launchStatus: launchStatus,
                            launchstartdate: launchstartdate,
                            launchenddate: launchenddate,
                            timerange:timerange,
                            timeslots: timeslots






                            })
                         .then(user => {
                                 req.flash(
                                 'success_msg',
                                 'Room updated!'
                                 );
                                 res.redirect('/staff');
                             })
                             .catch(err => console.log(err));





                     }

                     }






         )}}})
