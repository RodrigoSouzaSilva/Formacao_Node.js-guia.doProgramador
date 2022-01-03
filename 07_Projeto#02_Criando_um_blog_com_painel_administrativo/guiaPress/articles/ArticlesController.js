const express = require('express')
const router = express.Router()
const Category = require('../categories/Category')
const Article = require('./Article')
const slugify = require('slugify')

router.get('/admin/articles', (req, res) => {
    Article.findAll({
        include:[{model:Category}]
    }).then(articles => {
        res.render('admin/articles/index', {articles: articles})
    })
})

router.get('/admin/articles/new', (req, res) => {
    Category.findAll().then(categories => {
        res.render('admin/articles/new', {categories: categories})
    })
})

router.post('/articles/save', (req, res) => {
    let title = req.body.title         // titulo do artigo
    let body = req.body.body           // corpo do artigo
    let category = req.body.category   // id do artigo

    Article.create({
        title: title,
        slug: slugify(title),
        body: body,
        categoryId: category  // Chave estrangeira, temos essa chave porque fizemos
                              // esse relacionamento Article.belongsTo(Category)
    }).then(() => {
        res.redirect('/admin/articles')
    })
})

router.post('/articles/delete', (req, res) => {
    let id = req.body.id

    if(id != undefined){
        if(!isNaN(id)){  // FOR um número
            Article.destroy({
                where: {
                    id: id
                }
            }).then( () => {
                res.redirect('/admin/articles')
            })
        } else { // Não for um número
            res.redirect('/admin/articles')
        }
    } else {     // NULL
        res.redirect('/admin/articles')
    }
})

module.exports = router