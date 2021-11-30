const express = require('express')
const app = express()

// Dizendo para o Express usar o EJS como View engine
app.set('view engine', 'ejs')

app.get('/:nome/:lang', (req, res) => {
    let nome = req.params.nome
    let lang = req.params.lang
    let exibirMsg = false
    res.render('index', {
        nome: nome,
        lang: lang,
        empresa: 'Guia do programador',
        inscrito: 8000,
        msg: exibirMsg
    })
})

app.listen(8080, () => {
    console.log('App rodando');
})