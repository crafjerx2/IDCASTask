const express = require('express')
const router = express.Router()
const { body } = require('express-validator');

const projectController = require('../controllers/projectController')
const taskController = require('../controllers/taskController')
const userController = require('../controllers/userController')

module.exports =  function() {
    // Home
    router.get('/', 
        userController.isAuth,
        projectController.home
    )

    // Proyects
    router.get('/proyecto/crear', 
        userController.isAuth,
        projectController.create
    )

    router.post('/proyecto/crear',
        userController.isAuth,
        body('name').not().isEmpty().trim().escape(),
        projectController.store
    )

    router.get('/proyecto/:url', 
        userController.isAuth,
        projectController.single
    )

    router.get('/proyecto/editar/:id', 
        userController.isAuth,
        projectController.edit
    )

    router.post('/proyecto/update/:id',
        userController.isAuth,
        body('name').not().isEmpty().trim().escape(),
        projectController.update
    )

    router.delete('/proyecto/destroy/:id', 
        userController.isAuth,
        projectController.destroy
    )

    // Task
    router.post('/proyecto/task/:id', 
        userController.isAuth,
        body('name').not().isEmpty().trim().escape(),
        taskController.create
    )

    router.patch('/task/:id', 
        userController.isAuth,
        body('id').not().isEmpty().trim().escape(),
        taskController.update
    )

    router.delete('/task/:id',
        userController.isAuth, 
        body('id').not().isEmpty().trim().escape(),
        taskController.destroy
    )
    
    // Users
    router.get('/registro/crear', userController.create)
    router.post('/registro', userController.store)
    router.get('/usuario/login', userController.login)
    router.post('/usuario/auth', userController.auth)
    router.get('/usuario/logout', userController.logout)
    router.get('/usuario/reset-form', userController.resetForm)
    router.post('/usuario/create-token', userController.createToken)
    router.get('/usuario/:token', userController.getToken)
    router.post('/usuario/:token', userController.resetPassword)
    router.get('/usuario/active/:token', userController.activeUser)

    return router
}

