const { Project, Task } = require("../models")

exports.create = async (req, res, next) => {
    const project = await Project.findOne({ where: { id: req.params.id }})
    if( !project ) return next()

    // Data
    const data  = {
        name: req.body.name,
        status: 0,
        ProjectId: project.id
    }
    
    // save
    const task = await Task.create(data)

    if( !task ) return next()

    // Redirect
    res.redirect(`/proyecto/${project.url}`)

}

exports.update = async (req, res, next) => {
    // search task
    const task = await Task.findOne({ where: {id: req.params.id} })

    // validate daata
    if( !task ) return next()

    // update
    const status = !task.status
    task.update({ status })

    // Redirect
    res.send('Tarea actualizada correctamente.')
}

exports.destroy = async (req, res, next) => {
    // search task
    const task = await Task.findOne({ where: {id: req.params.id} })

    // validate daata
    if( !task ) return next()

    // update
    task.destroy()

    // Redirect
    res.send('Tarea eliminada correctamente.')
}