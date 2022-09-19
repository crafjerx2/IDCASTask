const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy

const { User } = require('../models')

passport.use(
    new LocalStrategy(
        {
            usernameField: 'email',
            passwordField: 'password'
        },
        async (email, password, done) => {
            try {
                const user = await User.findOne({ where: { email: email } })

                // password incorrect
                if(! user.verifyPassword(password)) {
                    return done(null, false, {
                        message: 'Password y cuenta no coinciden.'
                    })
                }

                if(!user.active) {
                    return done(null, false, {
                        message: 'La cuenta no esta activa.'
                    }) 
                }

                return done(null, user)

            } catch (error) {
                return done(null, false, {
                    message: 'Cuenta no existe.'
                })
            }
        }
    )
)

passport.serializeUser((user, callback) => {
    callback(null, user)
})
passport.deserializeUser((user, callback) => {
    callback(null, user)
})

module.exports = passport
