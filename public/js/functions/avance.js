const updateAvance = () => {
    const tasks = document.querySelectorAll('li.tarea')
    const tasksCount = tasks.length 

    if( tasksCount ) {
        const taskComplete = document.querySelectorAll('.done_all')
        const taskCompleteCount = taskComplete.length

        const avance = Math.round((taskCompleteCount / tasksCount) * 100)

        const metric = document.querySelector('#porcentaje')
        metric.style.width = `${avance}%`
    }
}

export {
    updateAvance
}