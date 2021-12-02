const express = require('express')
const app = express()

// Dizendo para o Express usar o EJS como View engine
app.set('view engine', 'ejs')

app.use(express.static('public'))

app.get('/', (req, res) => {
    res.send('Olá você está na página principal do projeto')
})

app.get('/:nome/:lang', (req, res) => {
    let nome = req.params.nome
    let lang = req.params.lang
    let exibirMsg = false


    let produtos = [
        {nome: 'Doritos', preco: 3.14},
        {nome: 'Coca-Cola', preco: 5},
        {nome: 'Leite', preco: 1.45},
        {nome: 'Carne', preco: 15},
        {nome: 'Red-Bull', preco: 6}
    ]


    res.render('index', {
        nome: nome,
        lang: lang,
        empresa: 'Guia do programador',
        inscrito: 8000,
        msg: exibirMsg,
        produtos: produtos
    })
})

app.listen(8080, () => {
    console.log('App rodando na porta http://localhost:8080/');
})