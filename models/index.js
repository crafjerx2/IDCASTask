const { DataTypes } = require('sequelize')
const { sequelize  } = require('../config/db')
const slug = require('slug')
const shortId = require('shortid')
const bcrypt = require('bcrypt')

const Project = sequelize.define('Project', {
    id: {
        type: DataTypes .INTEGER(11),
        primaryKey: true,
        autoIncrement: true
    },
    name: DataTypes.STRING(100),
    url: DataTypes.STRING(100),
}, {
    hooks: {
        beforeCreate(project) {
            const url = slug(project.name).toLowerCase()
            project.url = `${url}-${shortId.generate()}`
        }
    }
})

const Task = sequelize.define('Task', {
    id: {
        type: DataTypes .INTEGER(11),
        primaryKey: true,
        autoIncrement: true
    },
    name: DataTypes.STRING(100),
    status: DataTypes.INTEGER(1)
})

const User = sequelize.define('User', {
    id: {
        type: DataTypes .INTEGER(11),
        primaryKey: true,
        autoIncrement: true
    },
    email: {
        type: DataTypes.STRING(60),
        allowNull: false,
        validate: {
            isEmail: { 
                msg: 'El email debe ser válido.'
            },
            notEmpty: {
                msg: 'El email es requerido.'
            }
        },
        unique: {
            args: true,
            msg: 'El usuario ya esta registrado.'
        }
    },
    password: {
        type: DataTypes.STRING(60),
        allowNull: false,
        validate: {
            notEmpty: {
                msg: 'La contraseña es requerido.'
            }
        }
    },
    token: DataTypes.STRING,
    expiration: DataTypes.DATE,
    active: {
        type: DataTypes.TINYINT(1),
        defaultValue: 0
    }
})
// Relationships
Task.belongsTo(Project)
Project.hasMany(Task)
User.hasMany(Project)

User.prototype.verifyPassword = function(password)  {
    return bcrypt.compareSync(password, this.password)
}



module.exports = {
    Project, 
    Task,
    User
}
