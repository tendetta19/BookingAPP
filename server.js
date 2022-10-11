//indevelopment
//taskkill /f /im node.exe boomnodejs
if (process.env.NODE_ENV !== 'production') {
    //Loading your environment variables is a one-liner:
    require('dotenv').config()
}
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
const passport= require('passport')
require('./config/passport')(passport)
app.use(express.urlencoded({ extended:false}))
app.use(session({
    secret: process.env.SESSION_SECRET ,
    resave: true,
    saveUninitialized: true, 
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
    const authlevel = []
    User.findOne({
        studentID: studentID


    }, 
    ).then(user => {
        authlevel.push('/'+user.role)  

        }

     
 

)
      
    passport.authenticate('local', {
    successRedirect:authlevel,
    failureRedirect:'/',
    failureFlash:true
})(req,res,next)



})

app.get('/forgetpassword',  (req, res) => {


    res.render("forgetpassword")


})
app.get('/register',  (req, res) => {


    res.render("register")


})
app.get('/student',ensureAuthenticated,  (req, res) => {
 
   

    res.render("student", {
        name:req.user.fullname


    })


})

app.get('/staff',ensureAuthenticated,  (req, res) => {
 
   

    res.render("staff", {
        name:req.user.fullname


    })


})
// bodyParser get data from form express.urlencoded() is a method inbuilt in express to recognize the incoming Request Object as strings or array


/*Forces the session to be saved back to the session store, even if the session was never modified during the request. Depending on your store this may be necessary, but it can also create race conditions where a client makes two parallel requests to your server and changes made to the session in one request may get overwritten when the other request ends, even if it made no changes (this behavior also depends on what store you're using).

The default value is true, but using the default has been deprecated, as the default will change in the future. Please research into this setting and choose what is appropriate to your use-case. Typically, you'll want false.

How do I know if this is necessary for my store? The best way to know is to check with your store if it implements the touch method. If it does, then you can safely set resave: false. If it does not implement the touch method and your store sets an expiration date on stored sessions, then you likely need resave: true. */
//forgetpassword 
    
    
    
    
    
     
            



app.get('/logout', (req, res) => {
    req.logout(err => {
        req.flash('success_msg', 'You are logged out');
        res.redirect('/');
    });
   
  });
app.post('/forgetpassword',  async (req, res) => {
    const {studentID, password, confirmPassword, role} = req.body
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


           
app.post('/register',  async (req, res) => {
    const hashedpassword = await bcrypt.hash(req.body.password, 10)
    const {fullname, studentID, email, password, confirmPassword, role} = req.body
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


        }, 
        {
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
                        role


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


    
    
    /* try {
        const hashedPassword = await bcrypt.hash(req.body.password, 10)
        users.push({
            id: Date.now().toString(),
            fullname: req.body.fullname,
            studentID: req.body.studentID,
            email: req.body.email,
            password: hashedPassword
        })
        res.redirect('/')
    } catch {
        res.redirect('/register')
    }*/
 

)}})