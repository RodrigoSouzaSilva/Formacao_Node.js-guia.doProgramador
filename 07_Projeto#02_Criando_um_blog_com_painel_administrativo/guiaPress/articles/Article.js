const Sequelize = require('sequelize')
const connection = require('../database/database')
const Category = require('../categories/Category')

const Article = connection.define('articles', {
    title:{
        type: Sequelize.STRING,
        allowNull: false
    },
    slug: {
        type: Sequelize.STRING,
        allowNull: false
    },
    body: {
        type: Sequelize.TEXT,
        allowNull: false
    }
})

Article.belongsTo(Category) // um Articles pertence á uma Category
Category.hasMany(Article)   // Uma Category tem muitos Articles

//Article.sync({force:true}) APAGAR

module.exports = Article