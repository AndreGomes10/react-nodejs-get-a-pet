const router = require('express').Router()

const UserController = require('../controllers/UserController')

// middleware
const verifyToken = require('../helpers/verify-token')
const { imageUpload } = require('../helpers/image-upload')

router.post('/register', UserController.register)
router.post('/login', UserController.login)
router.get('/checkuser', UserController.checkUser)
router.get('/:id', UserController.getUserById)
router.patch('/edit/:id', 
        verifyToken, 
        imageUpload.single('image'), 
        UserController.editUser)  // essa função esta protegida com verifyToken, patch, porque é uma rota de atualização

module.exports = router