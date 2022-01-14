const express = require('express')
const router = express.Router()
const User = require('./User')
const bcrypt = require('bcryptjs')

router.get('/admin/users', (req, res) => {
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

module.exports = router