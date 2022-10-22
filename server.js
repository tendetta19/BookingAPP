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
    res.render('index')
})

app.post('/',  async (req, res, next) => {
    const {studentID, password} = req.body 
    
    const lastlogin= new Date().toLocaleString("en-US", {timeZone: "Asia/Singapore"})
const authlevel = []

    User.findOne({
        studentID: studentID


    },
    ).then(user => {
        if(user){
            
            User.findOneAndUpdate({studentID: user.studentID},{lastlogin: lastlogin})   
            .then(user => {
                console.log("Last login updated to "+ lastlogin)
            })
            .catch(err => console.log(err));
            

        authlevel.push('/'+user.role)}

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


    res.render("forgetpassword")


})
app.get('/settings/changePassword',ensureAuthenticated,  (req, res) => {


    res.render("settings/changePassword", {
        name:req.user.fullname


    })


})
app.get('/register',  (req, res) => {


    res.render("register")


})
app.get('/staffDash',ensureAuthenticated,   (req, res) => {


    res.render("staffDash", {
        name:req.user.fullname


    })


})
app.get('/admin',ensureAuthenticated,   (req, res) => {


    res.render("admin", {
        name:req.user.fullname


    })


})
app.get('/createroom',ensureAuthenticated,   (req, res) => {


    res.render("createroom", {
        name:req.user.fullname


    })


})
app.get('/editroom',ensureAuthenticated,   (req, res) => {


    res.render("editroom", {
        name:req.user.fullname


    })


})
app.get('/settings',ensureAuthenticated,  (req, res) => {


    res.render("settings", {
        name:req.user.fullname


    })


})
app.get('/settings/payment',ensureAuthenticated,  (req, res) => {
      res.render("settings/payment", {
        name:req.user.fullname


    })


})
app.get('/student',ensureAuthenticated,  (req, res) => {



    res.render("student", {
        name:req.user.fullname,


    }) 


})
app.get('/roomData',ensureAuthenticated,  (req, res) => {
    rooms.find({}, function(err, room) {
        roomsList = room

        res.json({
            "data": roomsList
          })


    }
    )





})

app.get('/deleteroom',ensureAuthenticated,  (req, res) => {
    res.render("deleteroom", {
        name:req.user.fullname,



    },

    )





})
app.get('/staff',ensureAuthenticated,  (req, res) => {
    res.render("staff", {
        name:req.user.fullname,



    },

    )





})
// bodyParser get data from form express.urlencoded() is a method inbuilt in express to recognize the incoming Request Object as strings or array


/*Forces the session to be saved back to the session store, even if the session was never modified during the request. Depending on your store this may be necessary, but it can also create race conditions where a client makes two parallel requests to your server and changes made to the session in one request may get overwritten when the other request ends, even if it made no changes (this behavior also depends on what store you're using).

The default value is true, but using the default has been deprecated, as the default will change in the future. Please research into this setting and choose what is appropriate to your use-case. Typically, you'll want false.

How do I know if this is necessary for my store? The best way to know is to check with your store if it implements the touch method. If it does, then you can safely set resave: false. If it does not implement the touch method and your store sets an expiration date on stored sessions, then you likely need resave: true. */
//forgetpassword










app.get('/logout', (req, res) => {
    const lastlogout= new Date().toLocaleString("en-US", {timeZone: "Asia/Singapore"})
    studentID= req.user.studentID  
    User.findOne({
        studentID: studentID



    },
    ).then(user => {
        if(user){       
            User.findOneAndUpdate({studentID: user.studentID},{lastlogout: lastlogout})   
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
    const {studentID, password, confirmPassword} = req.body
    const hashedpassword = await bcrypt.hash(req.body.password, 10)
    let errors = []
    if (password != confirmPassword){
        errors.push({ msg: "Passwords must be the same"})
    }
    if(errors.length > 0){
        res.render('forgetpassword', {
            errors,

        })
    } else{
        User.findOne({
            studentID: studentID


        },
        )

        .then(user => {
            if(!user){
                errors.push({msg: 'There is no user with that ID'})
                // User exists
                res.render('forgetpassword', {
                    errors,

                })
            }
                else  {
               User.findOneAndUpdate({studentID: user.studentID},{hashedpassword: hashedpassword})
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

app.post('/changePassword',  async (req, res) => {
    const {ipassword, password, confirmPassword} = req.body
    const hashedpassword = await bcrypt.hash(req.body.password, 10)
    let errors = []
    name=req.user.fullname
    //bcrypt.compare(password, user.hashedpassword, (err, isMatch)
    })


app.post('/register',  async (req, res) => {
    const hashedpassword = await bcrypt.hash(req.body.password, 10)
    const {fullname, studentID, email, password, confirmPassword, role} = req.body
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
    if (fullnamecheck.test(studentID)){
        errors.push({ msg: "Please only include numbers in your Student ID"})
    }  if (!IDcheck.test(studentID)){
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
        res.render('register', {
            errors,

        })
    } else{
        /* Checks if there is any email in the database that is the same as the post request
            If User.findone returns a result (e.g user), person is already in DB and it'll push an error
            If it does not return anything (i.e user doesnt exist), use mongomodel to push a new user
        */
        User.findOne({
            studentID: studentID


        ,
            email:email
        })

        .then(user => {
            if(user){
                errors.push({msg: 'Student ID/Email is already in use'})
                // User exists
                res.render('register', {
                    errors,

                })
            }
                else  {
                    //Push since user doesnt exist model to create new user
                    const newUser = new User({
                        fullname,
                        studentID,
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


app.post('/createroom',  async (req, res) => {
   // console.log(name)
    const {roomID, price, roomCapacity, promotionalCode, launchStatus,launchstartdate,launchenddate,openinghour,closinghour} = req.body

  
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
if (!timecheck.test(openinghour) && !timecheck.test(closinghour)){
        errors.push({ msg: "Please enter a valid time ending with :00"})
    }


    if(errors.length > 0){
        res.render('createroom', {
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

                res.render('createroom', {
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
         res.render('deleteroom', {
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

                    res.render('editroom', {
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
                 res.render('editroom', {
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

                            res.render('editroom', {
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

                         res.render('editroom', {
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
                            launchenddate: launchenddate






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
