const { Project, Task } = require("../models")


exports.home = async (req, res) => {
    const projects = await Project.findAll({
        where: { UserId: res.locals.user.id }
    })

    res.render('index', {
        titlePage: 'Home',
        projects
    })
}

exports.create = async (req, res) => {
    const projects = await Project.findAll({
        where: { UserId: res.locals.user.id }
    });

    res.render('create-project', {
        titlePage: 'Crear Proyecto',
        projects
    })
}

exports.store = async (req, res) => {
    const projects = await Project.findAll({
        where: { UserId: res.locals.user.id }
    });

    const { name } = req.body
    let errors = []

    if (! name) {
        errors.push({
            text: 'Debes agregar un nombre.'
        })
    }

    if( errors.length > 0 ) {
        res.render('create-project', {
            titlePage: 'Crear Proyecto',
            errors,
            projects
        })
    } else {
        const UserId = res.locals.user.id
        await Project.create({ name, UserId })
        res.redirect('/')
    }
}

exports.single = async (req, res, next) => {
   
    try{
        const projectsPromise = await Project.findAll({
            where: { UserId: res.locals.user.id }
        });

        const projectPromise = await Project.findOne({
            where: {
                url:req.params.url
            }
        })
        
        const [projects, project] = await Promise.all([projectsPromise, projectPromise])
        if ( !project ) return next()

       const tasks = await Task.findAll({
        where: { projectId: project.id}
       })

        res.render('single', {
            titlePage: 'Tareas del Proyecto',
            project,
            projects,
            tasks
        })
    } catch(err) {
        console.log({err})
    }
}

exports.edit = async (req, res) => {
    try{
        const projectsPromise = await Project.findAll({
            where: { UserId: res.locals.user.id }
        });

        const projectPromise = await Project.findOne({
            where: {
                id:req.params.id
            }
        })
        
        const [projects, project] = await Promise.all([projectsPromise, projectPromise])
        if ( !project ) return next()

        res.render('create-project', {
            titlePage: 'Editar Proyecto',
            project,
            projects
        })
    } catch(err) {
        console.log({err})
    }
}

exports.update = async (req, res) => {
    const projects = await Project.findAll({
        where: { UserId: res.locals.user.id }
    });

    const { name } = req.body
    let errors = []

    if (! name) {
        errors.push({
            text: 'Debes agregar un nombre.'
        })
    }

    if( errors.length > 0 ) {
        res.render('create-project', {
            titlePage: 'Crear Proyecto',
            errors,
            projects
        })
    } else {
        await Project.update(
            { name },
            { where: { id: req.params.id } })
        res.redirect('/')
    }
}

exports.destroy = async (req, res, next) => {
   
    try{
        
        const project = await Project.findOne({
            where: {
                id:req.query.id
            }
        })
            
        project.destroy()

        res.send('Projecto eliminado correctamente.')
    } catch(err) {
        next()
    }
}


