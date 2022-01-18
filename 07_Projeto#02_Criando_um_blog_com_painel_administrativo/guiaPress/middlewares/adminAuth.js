function adminAuth(req, res, next) {
    if(req.session.user != undefined){
        next()
    } else{
        res.redirect('/login')
        //next()    PARA LIBERAR ACESSO EM TESTES
    }
}




module.exports = adminAuth