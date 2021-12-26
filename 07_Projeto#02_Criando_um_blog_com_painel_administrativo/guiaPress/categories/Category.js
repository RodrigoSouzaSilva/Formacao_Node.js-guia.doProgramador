const Sequelize = require('sequelize')
const connection = require('../database/database')

const Category = connection.define('categories', {
    title: {
        type: Sequelize.STRING,
        allowNull: false
    },
    slug: {
        type: Sequelize.STRING,
        allowNull: false
    }
})

//Category.sync({force:true}) APAGAR

module.exports = Category