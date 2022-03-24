const express = require('express')
const router = express.Router()
const UserController = require('../controllers/userController.js')
const checkUserAuth = require('../middlewares/authMiddlewares.js')

//route level middleware - to protect route
router.use('/changepassword', checkUserAuth)
router.use('/loggeduserdata', checkUserAuth)

//public routes
router.post('/register', UserController.userRegistration)
router.post('/login', UserController.userLogin)

//protected routes
router.post('/changepassword', UserController.changeUserPassword)
router.get('/loggeduserdata', UserController.loggedUserData)

module.exports = router