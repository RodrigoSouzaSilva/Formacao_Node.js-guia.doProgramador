const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const connection = require('./database/database')
const session = require('express-session')

// Body-parser
app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())

// Dominios relacionados
const categoriesController = require('./categories/CategoriesController')
const articlesController = require('./articles/ArticlesController')
const userController = require('./user/Usercontroller')

// Importando os Models
const Article = require('./articles/Article')
const Category = require('./categories/Category')
const User = require('./user/User')

// Viem Engine
app.set('view engine', 'ejs')

// Ativar gerenciamento de sessão
app.use(session({
    secret: 'qualquercoisa',
    cookie: {
        maxAge: 30000
    }
}))

// Static
app.use(express.static('public'))

// Database
connection.authenticate()
.then(() => {
    console.log('Conexão feita com sucesso');
})
.catch( err => {
    console.log('ERRO ao conectar ao BANCO DE DADOS '+ err);
})

// Rotas que INCLUEM os Dominios Relacionados
app.use('/', categoriesController)
app.use('/', articlesController)
app.use('/', userController)

// Rotas SIMPLES
app.get('/', (req, res) => {
    Article.findAll( {
        order: [
            ['id','DESC']
        ],
        limit: 4
    }).then(articles => {
        Category.findAll().then( categories => {
            res.render('index', {articles: articles, categories: categories})
        })
    })
})

app.get('/:slug', (req, res) => {
    let slug = req.params.slug

    Article.findOne({
        where: {
            slug: slug
        }
    }).then( article => {
        if (article != undefined) {
            Category.findAll().then( categories => {
                res.render('article', {article: article, categories: categories})
            })
        } else {
            res.redirect('/')
        }
    }).catch(err => {
        res.redirect('/')
    })
})

app.get('/category/:slug', (req, res) => {
    let slug = req.params.slug

    Category.findOne({
        where: {
            slug: slug
        }, 
        include: [{model: Article}] // JOIN com model de Article
    }).then(category => {
        if(category != undefined){
            Category.findAll().then(categories => {
                res.render('index', {articles: category.articles, categories: categories})
            })
        } else {
            res.redirect('/')
        }
    }).catch(err => {
        res.redirect('/')
    })
})

// Porta que está rodando nossa aplicação
app.listen(8080, () => {
    console.log('O Servidor está rodando na porta 8080');
})