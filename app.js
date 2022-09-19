const express = require('express')
const router = require('./routes')
const path = require('path')
const bodyParser = require('body-parser')
const flash = require('connect-flash')
const session = require('express-session')
const cookieParser = require('cookie-parser')
const passport = require('./config/passport')

const { dbConn } = require('./config/db')
const helpers  = require('./helpers')


// DB
require('./models')
dbConn()

// app
const app = express()

// Static Files
app.use(express.static('public')) 

// pug
app.set('view engine', 'pug')

// Set Views
app.set('views',path.join(__dirname, './views'))

app.use(bodyParser.urlencoded({extended: true}))

app.use(cookieParser())

app.use(session({
    secret: 'super-secret',
    resave: false,
    saveUninitialized: false
}))

app.use(passport.initialize())
app.use(passport.session())

app.use(flash())

app.use((req, res, next) => {
    res.locals.vardump = helpers.vardump
    res.locals.messages = flash()
    res.locals.user = {...req.user} || null
    next();
})

// Middleware
app.use('/', router())

// Start app
app.listen(3000)

require('./handles/email')
