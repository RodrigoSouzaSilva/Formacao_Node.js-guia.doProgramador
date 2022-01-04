const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const connection = require('./database/database')

// Body-parser
app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())

// Dominios relacionados
const categoriesController = require('./categories/CategoriesController')
const articlesController = require('./articles/ArticlesController')

// Importando os Models
const Article = require('./articles/Article')
const Category = require('./categories/Category')

// Viem Engine
app.set('view engine', 'ejs')

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

// Rotas SIMPLES
app.get('/', (req, res) => {
    Article.findAll( {
        order: [
            ['id','DESC']
        ]
    }).then(articles => {
        res.render('index', {articles: articles})
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
            res.render('article', {article: article})
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