const express = require('express')
const router = express.Router()
const ToughtsController = require('../controllers/ToughtsController')

const checkAuth = require('../helpers/auth').checkAuth

router.get('/', ToughtsController.showToughts)
router.get('/add', ToughtsController.addTought)
router.post('/add', ToughtsController.saveTought)
router.get('/dashboard', checkAuth, ToughtsController.dashboardToughts)
router.get('/remove/:id', checkAuth, ToughtsController.remove)

module.exports = router