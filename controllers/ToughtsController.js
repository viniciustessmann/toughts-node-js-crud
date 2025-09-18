const Tought = require('../models/Tought');
const User = require('../models/User');

module.exports = class ToughtsController {

    static async showToughts (req, res) {

        const toughtsData = await Tought.findAll({include: User})
        
        const toughts = toughtsData.map((result) => result.get({plain: true}) )

        console.log(toughts)

        res.render('toughts/home', {toughts})
    }

    static async dashboardToughts (req, res) {

        const userId = req.session.userid;

        const user = await User.findOne({
            where: {id: userId},
            include: Tought,
            plain: true
        })

        if (!user) {
            res.redirect('/auht/login')
        }

        const toughts = user.Toughts.map( (result) => result.dataValues)

        res.render('toughts/dashboard', {toughts})
    }

    static addTought(req, res) {
        res.render('toughts/create')
    }

    static async saveTought(req, res) {

        await Tought.create({
            title: req.body.title,
            UserId: req.session.userid
        })

        req.flash('message', 'Pensamento criado com sucesso!')
        req.session.save( () => {
            res.redirect('/toughts')
        })
        
    }

    static async remove(req, res) {
        const id = req.params.id;

        await Tought.destroy({where: {id: id}})

        req.flash('message', 'Pensamento apagado!')
        req.session.save( () => {
            res.redirect('/toughts/dashboard')
        })
    }
}