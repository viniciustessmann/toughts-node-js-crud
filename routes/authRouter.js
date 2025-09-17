const express = require('express')
const AuthController = require('../controllers/AuthController')
const router = express.Router()


router.get('/register', AuthController.register)
router.post('/register', AuthController.registerPost)
router.get('/login', AuthController.login)
router.get('/logout', AuthController.logout)
router.post('/login', AuthController.loginPost)

module.exports = router

