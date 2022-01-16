const express = require('express')
const router = express.Router()
const User = require('./User')
const bcrypt = require('bcryptjs')

router.get('/admin/users', (req, res) => {

    if(req.session.user == undefined){ //Não existe a sessão user
        res.redirect('/')
    }

    User.findAll().then(users => {
        res.render('admin/users/index', {users: users})
    })
})

router.get('/admin/users/create', (req, res) => {
    res.render('admin/users/create')
})

router.post('/users/create', (req, res) => {
    let email = req.body.email
    let password = req.body.password

    User.findOne({ // Procura no banco, onde email seja igual ao email passado
        where:{
            email: email
        }
    }).then(user => { // O valor da pesquisa será enviado para user

        if(user == undefined){  // Caso NÃO exista
            let salt = bcrypt.genSaltSync(10)
            let hash = bcrypt.hashSync(password, salt)

            User.create({
                email:email,
                password:  hash
            }).then(() => {
                res.redirect('/')
            }).catch(err => {
                res.redirect('/')
            })
        } else {                 // Caso EXISTA
            res.redirect('/admin/users/create')
        }
    })    
})

router.get('/login', (req, res) => {
    res.render('admin/users/login')
})

router.post('/authenticate', (req, res) => {
    let email = req.body.email
    let password = req.body.password

    User.findOne({where: {email: email}}).then(user => {
        if(user != undefined){ // SE EXISTE usuario com esse email
            //Validar senha
            let correct = bcrypt.compareSync(password, user.password)

            if(correct){ // Cria a sessão user
                req.session.user = {
                    id: user.id,
                    email: user.email
                }
                res.redirect('/admin/articles')
            } else {
                res.redirect('/login')
            }
        } else {
            res.redirect('/login')
        }
    })
})

router.get('/logout', (req, res) => {
    req.session.user = undefined // deixar o user nulo
    res.redirect('/')
})

module.exports = router