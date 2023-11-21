const multer = require('multer')
const path = require('path')

// Destination to store the images
const imageStorage = multer.diskStorage({
    destination: function(req, file, cb) {
        let folder =''

        if(req.baseUrl.includes('users')) {
            folder = 'users'
        } else if(req.baseUrl.includes('pets')) {
            folder = 'pets'
        }

        cb(null, `public/images/${folder}`)  // o caminho onde vai ser salvo
    },
    filename: function(req, file, cb) {
        // vai incluir a data atual que o arquivo é salvo evitando a substituição de imagens
        // e vai concatenar o nome original do arquivo e acha a extensão dele e concatena junto com a data atual
        cb(
            null,
            Date.now() + 
            String(Math.floor(Math.random() * 100)) + 
            path.extname(file.originalname))
    },
})

const imageUpload = multer({
    storage: imageStorage,
    fileFilter(req, file, cb) {  // fileFilter, consegue filtrar quais arquivos quero receber
        
        if(!file.originalname.match(/\.(png|jpg)$/)) {  // se não for png ou jpg, ele vai analisar o fim do arquivo e quando encontrar o ponto
                                                        // se ele não verificar um png ou jpg ele entra no if
            return cb(new Error('Por favor, envie apenas jpg ou png!'))
        }

        cb(undefined, true)  // pra finalisar o ciclo da configuração
    },
})

module.exports = { imageUpload }