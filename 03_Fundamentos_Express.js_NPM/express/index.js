const express = require('express')
// Importando o express

const app = express()
// Iniciando o express


app.get('/', (req, res) => {
    res.send('<h1>Sou uma página principal</h1>')
})

app.get('/blog/:artigo?', (req, res) => {
    let artigo = req.params.artigo

    if(artigo) {
        res.send(`Você está no blog do artigo de ${artigo}`)
    }
    else {
        res.send('Bem vindo ao meu blog')
    }
})

app.get('/canal/youtube', (req, res) => {
    let canal = req.query['canal']

    if(canal) {
        res.send(`<h1>Você está no canal do ${canal}</h1>`)
    } else {
        res.send('<h1>Bem vindo ao Youtube</h1>')
    }
})

app.get('/ola/:nome/:empresa', (req, res) => {
    // REQ => DADOS ENVIADOS PELO USUÁRIO
    // RES => RESPOSTA QUE VAI SER ENVIADA PARA O USUÁRIO
    let nome = req.params.nome
    let empresa = req.params.empresa
    res.send(`<h1>Oi ${nome} do ${empresa}</h1>`)
})

app.listen(4000, erro => {
    if(erro) console.log('Ocorreu  um ERRO!')
    else console.log('Servidor iniciado com sucesso!!!')
})