const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const connection = require('./database/database')

// Dominios relacionados
const categoriesController = require('./categories/CategoriesController')
const articlesController = require('./articles/ArticlesController')


// Viem Engine
app.set('view engine', 'ejs')

// Static
app.use(express.static('public'))

// Body-parser
app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())

// Database
connection.authenticate()
.then(() => {
    console.log('Conexão feita com sucesso');
})
.catch( err => {
    console.log('ERRO ao conectar ao BANCO DE DADOS '+ err);
})


app.use('/', categoriesController)
app.use('/', articlesController)

app.get('/', (req, res) => {
    res.render('index')
})

app.listen(8080, () => {
    console.log('O Servidor está rodando na porta 8080');
})