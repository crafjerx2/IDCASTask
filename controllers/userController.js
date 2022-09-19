const { User } = require('../models')
const bcrypt = require('bcrypt')
const passport = require('../config/passport')
const crypto = require('crypto')
const { Op } = require("sequelize");
const senEmail  = require('../handles/email')

exports.create = (req, res) => {
    res.render('users/create', {
        titlePage: 'Crear usuario'
    })
}

exports.store = async (req, res) => {
    // data
    let { email, password } = req.body;

    // validate)
    if( password ) {
        // Hash password
        password = bcrypt.hashSync(password, bcrypt.genSaltSync(10))
    }

    try {
        // create
        const token = crypto.randomBytes(20).toString('hex')
        const user = await User.create({
            email,
            password,
            token
        })
        
        const resetUrl = `http://${req.headers.host}/usuario/active/${user.token}`;
        await senEmail.send({
            user,
            subject: 'Activar Cuenta',
            resetUrl,
            fileHtml: 'active-account'
        })
    
        req.flash('sucess', 'Se ha enviado un mensaje a su correo.')
        res.render('users/login', {
            titlePage: 'Login',
            messages: req.flash()
        })
    
    } catch (error) {
        console.log( error )
        req.flash('error', error.errors.map(error => error.message ))
        res.render('users/create', {
            titlePage: 'Crear usuario',
            messages: req.flash(),
            email
        })
    }
}

exports.login = (req, res) => {
    const { error } = req.flash()
     res.render('users/login', {
        titlePage: 'Login',
        error
    })
}

exports.auth = passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/usuario/login',
    failureFlash: true,
    badRequestMessage: 'Ambos cambos son requeridos.'

})

exports.isAuth = (req, res, next) => {
    if(req.isAuthenticated()) {
        return next()
    }

    return res.redirect('/usuario/login')
}

exports.logout = (req, res) => {
    req.session.destroy(() => {
        res.redirect('/usuario/login')
    })
}

exports.resetForm = (req, res) => {
    res.render('users/form-reset-password', {
        titlePage: 'Reestablecer Contraseña'
    })
}

exports.createToken = async (req, res) => {
    const { email } = req.body
    const user = await User.findOne({ where: { email } })

    if ( !user ) {
        req.flash('error', 'La cuenta no existe.')
        res.render('users/form-reset-password', {
            titlePage: 'Reestablecer Contraseña',
            messages: req.flash()
        })
    }

    user.token = crypto.randomBytes(20).toString('hex')
    user.expiration =  Date.now() + 3600000
    
    await user.save()

    const resetUrl = `http://${req.headers.host}/usuario/${user.token}`;
    
    await senEmail.send({
        user,
        subject: 'Reestablecer Contraseña',
        resetUrl,
        fileHtml: 'reset-password'
    })

    req.flash('sucess', 'Se ha enviado un mensaje a su correo.')
    res.render('users/login', {
        titlePage: 'Login',
        messages: req.flash()
    })

}

exports.getToken = async (req, res) => {
    const token = req.params.token
    const user = await User.findOne({ where: { token } })

    if ( !user ) {
        req.flash('error', 'Token no válido.')
        res.render('users/form-reset-password', {
            titlePage: 'Reestablecer Contraseña',
            messages: req.flash()
        })
    }

    res.render('users/reset-password', {
        titlePage: 'Reestablecer Contraseña'
    })
}

exports.resetPassword = async (req, res) => {
    const user = await  User.findOne({ 
        where: {
            token: req.params.token,
            expiration: { [Op.gt]: Date.now() }
        }
    })

    if( !user ) {
        req.flash('error', 'Token no válido o token expirado.')
        res.render('users/form-reset-password', {
            titlePage: 'Reestablecer Contraseña',
            messages: req.flash()
        })
    }

    let password = req.body.password

    if( password ) {
        // Hash password
        password = bcrypt.hashSync(password, bcrypt.genSaltSync(10))
        user.password = password
    }

    try {

        await  user.update({ password })
        user.token = null
        user.expiration = null
        
    } catch (error) {
        req.flash('error', error.errors.map(error => error.message ))
        res.render('users/reset-password', {
            titlePage: 'Reestablecer Contraseña',
            messages: req.flash()
        }) 
    }

    req.flash('success', 'Tu contraseña ha sido actualizada correctamente.')
    res.render('users/login', {
        titlePage: 'Login',
        messages: req.flash()
    }) 
 }

 
exports.activeUser = async (req, res) => {
    const token = req.params.token
    const user = await User.findOne({ where: { token } })

    if ( !user ) {
        req.flash('error', 'Token no válido.')
        res.render('users/login', {
            titlePage: 'login',
            messages: req.flash()
        })
    }

    user.active = 1
    user.save()

    req.flash('error', 'Cuenta activada.')
    res.render('users/login', {
        titlePage: 'login',
        messages: req.flash()
    })
}