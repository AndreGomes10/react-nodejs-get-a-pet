const router = require('express').Router()
const PetController = require('../controllers/PetController')

//middlewares
const verifyToken = require('../helpers/verify-token')
const { imageUpload } = require('../helpers/image-upload')

router.post('/create', verifyToken, imageUpload.array('images'), PetController.create)
router.get('/', PetController.getAll)  // pegar todos os pets que tem no sistema e exibir na home
router.get('/mypets', verifyToken, PetController.getAllUserPets)  // pegar os pets do usuário, o usuário precisa estar cadastardo para acessar essa rota do sistema
router.get('/myadoptions', verifyToken, PetController.getAllUserAdoptions)  // a rota que exibe os pets que eu estou querendo adotar
router.get('/:id', PetController.getPetById)  // não precisa estar logado
router.delete('/:id', verifyToken, PetController.removePetById)
router.patch('/:id', verifyToken, imageUpload.array('images'), PetController.updatePet)
router.patch('/schedule/:id', verifyToken, PetController.schedule)
router.patch('/conclude/:id', verifyToken, PetController.concludeAdoption)

module.exports = router