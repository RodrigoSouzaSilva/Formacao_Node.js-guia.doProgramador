const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const connection = require('./database/database')
const Pergunta = require('./database/Pergunta')
const Resposta = require('./database/Resposta')

// Database
connection.authenticate()
.then(() => {console.log('Conexão feita com o banco de dados!');})
.catch((msgErro) => {console.log('Erro '+msgErro);})

// Dizendo para o Express usar o EJS como View engine
app.set('view engine', 'ejs')

// Informando nossa pasta de arquivo estaticos
app.use(express.static('public'))

// Configurando o body parser
app.use(bodyParser.urlencoded({extended:false}))
app.use(bodyParser.json())

// ROTAS
app.get('/', (req, res) => {
    Pergunta.findAll({raw: true, order: [
        ['id', 'DESC'] // ASC = crescente || DESC = Decrescente
    ]}).then(perguntas => {
        res.render('index.ejs', {
            perguntas: perguntas
        })
    })
})

app.get('/perguntar', (req, res) => {
    res.render('perguntar')
})

app.post('/salvarpergunta', (req, res) => {

    let titulo = req.body.titulo
    let descricao = req.body.descricao
    
    Pergunta.create({
        titulo: titulo,
        descricao: descricao
    }).then(() => {
        res.redirect('/')
    })
})

app.get('/pergunta/:id',(req, res) => {
    let id = req.params.id
    Pergunta.findOne({
        where: {id: id}
    }).then(pergunta => {
        if(pergunta != undefined){
            Resposta.findAll({
                where:{perguntaId: pergunta.id},
                order: [['id', 'DESC']]
            }).then(respostas => {
                res.render('pergunta', {
                    pergunta: pergunta,
                    respostas: respostas
                })
            })
        } else {
            res.redirect('/')
        }
    })
})

app.post('/responder', (req, res) => {
    let corpo = req.body.corpo
    let perguntaId = req.body.pergunta
    Resposta.create({
        corpo: corpo,
        perguntaId: perguntaId
    }).then(() => {
        res.redirect('/pergunta/'+perguntaId)
    })
})


// PORTA DO PROJETO
app.listen(8080, () => {
    console.log('App rodando na porta http://localhost:8080/');
})