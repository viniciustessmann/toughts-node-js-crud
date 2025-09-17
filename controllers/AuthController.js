const User = require('../models/User')
const bcrypt = require('bcrypt')

module.exports = class AuthController {
    
    static login(req, res) {
         res.render('auth/login')
    }

    static register(req, res) {
        res.render('auth/register')
    }

    static async registerPost(req, res) {

        const {name, email, password, confirmpassword} = req.body;

        if (password != confirmpassword) {
            req.flash('message', 'As senhas não conferem!')
            res.render('auth/register')
            return
        }

        if (await User.findOne({where: {email: email}})) {
            req.flash('message', 'E-mail já cadastrado!')
            res.render('auth/register')
            return
        }

        const salt = bcrypt.genSaltSync()
        const hashedPassword = bcrypt.hashSync(password, salt)

        const user = {
            name,
            email,
            password: hashedPassword
        }

        try {
            const createdUser = await User.create(user)
            req.session.userid = createdUser.id
            req.flash('message', 'Cadastro realizado com sucesso!')
            req.session.save( () => {
                res.redirect('/auth/login')
            })
            
        } catch (err)  {
            console.log(err)
        }
    }

    static logout(req, res) {
        req.session.destroy()
        res.redirect('/auth/register')
    }

    static async loginPost(req, res) {

        const {email, password} = req.body

        const user = await User.findOne({where: {email: email}})

        if (!user) {
            req.flash('message', 'Usuário não encontrado!')
            res.redirect('/auth/login')
        }

        const passowordMatch  = await bcrypt.compare(password, user.password);
        if (!passowordMatch) {
            req.flash('message', 'Senha inválida')
            res.redirect('/auth/login')
            return
        }

        req.session.userid = user.id
        req.session.save( () => {
            res.redirect('/toughts')
        })
        
    }
}