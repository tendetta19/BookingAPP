const LocalStrategy = require('passport-local').Strategy
const moongose = require('mongoose')
const bcrypt = require('bcryptjs')

//get User Model
const User = require('../models/user')

//export Strategy we're creating
//Grabbing current user then pass user to seralize, grab user and stuff information incookie(serialize),find user based onid(deserialize)
module.exports = function(passport) {
    passport.use(
        new LocalStrategy({
            usernameField: 'userID'
        }, (userID, password, done) => {
            //match user with ID
            User.findOne({
                userID: userID
                })
                .then(user => {
                    //no match (null = error, false = user)
                    if (!user) {
                        return done(null, false, {
                            message: 'That ID is not registered'
                        })
                    }
                    //keep going since user exists; match password (user.password) is from db

                    bcrypt.compare(password, user.hashedpassword, (err, isMatch) => {
                            if (err) throw err;
                            if (isMatch) {
                                return done(null, user)
                            } else {
                                return done(null, false, {
                                    message: 'Password is incorrect'
                                })
                            }


                        }


                    );


                })
                .catch(err => console.log(err))


        })
    );
    //jam user id intocookie to know who it is
    passport.serializeUser((user, done) => {
        done(null, user.id)



    })

    passport.deserializeUser((id, done) => {
        //whose d is it
        User.findById(id, (err, user) => {

            done(err, user)
        })



    })

}
