const express = require('express')
const router = express.Router()
const Category = require('./Category')
const slugify = require('slugify')
const Article = require('../articles/Article')

router.get('/admin/categories', (req, res) => {
    Category.findAll().then(categories => {
        res.render('admin/categories/index', {categories: categories})
    })
})

router.get('/admin/categories/new', (req, res) => {
    res.render('admin/categories/new')
})

router.post('/categories/save', (req, res) => {
    let title = req.body.title

    if(title.trim() != '' && title != '') {
        Category.create({
            title: title,
            slug: slugify(title)
        }).then( () => {
            res.redirect('/admin/categories')
        })
    } else {
        res.redirect('/admin/categories/new')
    }
})

router.post('/categories/delete', (req, res) => {
    let id = req.body.id //69

    if(id != undefined){
        if(!isNaN(id)){  // FOR um número
            // Category.destroy({where: {id: id}})
            Article.destroy({where: {categoryId: id}}).then(
                Category.destroy({where: {id: id}})
            )
            .then( () => {
                res.redirect('/admin/categories')
            })
            
            
        } else { // Não for um número
            res.redirect('/admin/categories')
        }
    } else {     // NULL
        res.redirect('/admin/categories')
    }
})

router.get('/admin/categories/edit/:id', (req, res) => {
    let id = req.params.id

    if(isNaN(id)){
        res.redirect('/admin/categories')
    }

    Category.findByPk(id).then( category => {
        if(category != undefined) {
            res.render('admin/categories/edit', {category: category})
        } else {
            res.redirect('/admin/categories')
        }
    }).catch( err => {
        res.redirect('/admin/categories')
    })
})

router.post('/categories/update', (req, res) => {
    let pegaId = req.body.id
    let novoTitle = req.body.title

    Category.update({title: novoTitle, slug: slugify(novoTitle)},{
        where: {
            id: pegaId
        }
    }).then(() => {
        res.redirect('/admin/categories')
    })
})

module.exports = router