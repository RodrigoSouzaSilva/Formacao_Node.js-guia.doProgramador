const express = require('express')
const router = express.Router()
const Category = require('../categories/Category')
const Article = require('./Article')
const slugify = require('slugify')

// Importando um MIDDLEWARE
const  adminAuth = require('../middlewares/adminAuth')

router.get('/admin/articles', adminAuth, (req, res) => {
    
    Article.findAll({
        include:[{model:Category}]
    }).then(articles => {
        res.render('admin/articles/index', {articles: articles})
    })
})

router.get('/admin/articles/new',adminAuth, (req, res) => {
    Category.findAll().then(categories => {
        res.render('admin/articles/new', {categories: categories})
    })
})

router.post('/articles/save', adminAuth, (req, res) => {
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
        if(!isNaN(id)){  // Se for um número
            Article.destroy({
                where: {
                    id: id
                }
            }).then(() => {
                res.redirect('/admin/articles')
            })
        } else { // Não for um número
            res.redirect('/admin/articles')
        }
    } else {     // NULL
        res.redirect('/admin/articles')
    }
})


router.get('/admin/articles/edit/:id', adminAuth, (req, res) => {
    let id = req.params.id
    Article.findByPk(id).then(article => {
        if(article != undefined) {
            Category.findAll().then(categories => {
                res.render('admin/articles/edit', {categories: categories, article: article})
                //res.send('Teste')
            })
        } else {
            res.redirect('/')
        }
    }).catch(err => {
        res.redirect('/')
    })   
})

router.post('/articles/update', adminAuth, (req, res) => {
    let id = req.body.id
    let title = req.body.title
    let body = req.body.body
    let category = req.body.category

    Article.update({ title: title, body: body, categoryId: category, slug: slugify(title)},{
        where: {
            id: id
        }
    }).then(() => {
        res.redirect('/admin/articles')
    }).catch(err => {
        res.redirect('/')
    })
})

router.get('/articles/page/:num', (req, res) => {
    let page = req.params.num
    let user = req.session.user

    if(isNaN(page) || page == 0) {
        offset = 0
    } else {
        offset = (parseInt(page) - 1) * 4
    }

    Article.findAndCountAll({

        // quando se trabalha com o findAndCountAll
        // ele retorna 2 coisa
        // count -> a quantidade de elemento que tem
        // rows  -> as listas de artigos

        limit: 4,
        offset: offset,
        order: [
            ['id', 'DESC']
        ]
    }).then(articles => {
        let next

        if(offset + 4 >= articles.count){
            next = false
        } else {
            next = true
        }

        let result = {
            page: parseInt(page),
            next: next,
            articles: articles
        }

        Category.findAll().then(categories => {
            res.render('admin/articles/page', {result: result, categories: categories, user: user})
        })
    })
})

module.exports = router