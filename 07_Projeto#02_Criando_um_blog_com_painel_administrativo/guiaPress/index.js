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
        maxAge: 30000000
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

// Rotas de sessoes
app.get('/session', (req, res) => {
    //req.session.cookie.expires = false Cancela o sumiço da session
    req.session.treinamento = 'Formação Node.js'
    req.session.ano = 2019
    req.session.email = 'victor@udemy.com'
    req.session.user = {
        username: 'Rodrigo',
        email: 'rodrigo_souza.91@hotmail.com',
        id: 10
    }

    res.send('Sessão gerada!!!')
})

app.get('/leitura', (req, res) => {
    res.json({
        treinamento: req.session.treinamento,
        ano: req.session.ano,
        email: req.session.email,
        user: req.session.user
    })
})

// Rotas SIMPLES
app.get('/', (req, res) => {
    let user = req.session.user
    Article.findAll( {
        order: [
            ['id','DESC']
        ],
        limit: 4
    }).then(articles => {
        Category.findAll().then( categories => {
            res.render('index', {articles: articles, categories: categories, user: user})
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

const PORT = process.env.PORT || 8080

app.listen(PORT, () => {
    console.log('O Servidor está rodando na porta '+PORT);
})