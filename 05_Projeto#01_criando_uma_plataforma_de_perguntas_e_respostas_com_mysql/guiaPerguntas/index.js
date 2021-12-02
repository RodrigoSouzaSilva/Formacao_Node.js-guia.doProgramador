const express = require('express')
const app = express()
const bodyParser = require('body-parser')

// Dizendo para o Express usar o EJS como View engine
app.set('view engine', 'ejs')

// Informando nossa pasta de arquivo estaticos
app.use(express.static('public'))

// Configurando o body parser
app.use(bodyParser.urlencoded({extended:false}))
app.use(bodyParser.json())

// ROTAS
app.get('/', (req, res) => {
    res.render('index.ejs')
})

app.get('/perguntar', (req, res) => {
    res.render('perguntar')
})

app.post('/salvarpergunta', (req, res) => {
    let titulo = req.body.titulo
    let descricao = req.body.descricao
    res.send('Formulario Recebido: Título: '+titulo +' Descrição: '+descricao )
})

// PORTA DO PROJETO
app.listen(8080, () => {
    console.log('App rodando na porta http://localhost:8080/');
})