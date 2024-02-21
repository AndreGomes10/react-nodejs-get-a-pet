const Pet = require('../models/Pet')

// helpers
const getToken = require('../helpers/get-token')
const getUserByToken = require('../helpers/get-user-by-token')
const ObjectId = require('mongoose').Types.ObjectId

module.exports = class PetController {

    // create a pet
    static async create(req, res) {
        const { name, age, weight, color } = req.body

        const images = req.files

        const available = true  // ela não vem do body, quando o pet for cadastrado ele tem que estar disponivel

        // images upload

        // validations
        if (!name) {
            res.status(422).json({ message: 'O nome é obrigatório!' })
            return
        }

        if (!age) {
            res.status(422).json({ message: 'A idade é obrigatória!' })
            return
        }

        if (!weight) {
            res.status(422).json({ message: 'O peso é obrigatório!' })
            return
        }

        if (!color) {
            res.status(422).json({ message: 'A cor é obrigatória!' })
            return
        }

        if (images.length === 0) {
        //if (!images) {
            res.status(422).json({ message: 'A imagem é obrigatória!' })
            return
        }

        // get pet owner
        const token = getToken(req)
        const user = await getUserByToken(token)

        // create a pet, em um objeto
        const pet = new Pet({
            name,
            age,
            weight,
            color,
            available,
            images: [],
            user: {
                _id: user._id,
                name: user.name,
                image: user.image,
                phone: user.phone,
            }
        })

        images.map((image) => {
            pet.images.push(image.filename)  // vai receber um array de objetos com varios dados da imagem
        })
        
        try {
            const newPet = await pet.save()

            res.status(201).json({
                message: 'Pet cadastrado com sucesso!',
                newPet,
            })
        } catch (error) {
            res.status(500).json({ message: error })
        }
    }

    // exibir todos os pets
    static async getAll(req, res) {
        // mostrar os pets novos primeiro
        const pets = await Pet.find().sort('-creatdAt')

        res.status(200).json({ pets: pets })
    }

    // exibir todos os pets do usuário
    static async getAllUserPets(req, res) {
        // get user from token
        const token = getToken(req)
        const user = await getUserByToken(token)

        const pets = await Pet.find({'user._id': user._id}).sort('-createdAt')

        res.status(200).json({ pets })
    }

    // get all user adoptions
    static async getAllUserAdoptions(req, res) {
        // get user from token
        const token = getToken(req)
        const user = await getUserByToken(token)

        const pets = await Pet.find({'adopter._id': user._id}).sort('-createdAt')  // adopter, o adotante

        res.status(200).json({ pets })
    }

    // get a specific pet
    // regatando pet pelo id
    static async getPetById(req, res) {
        const id = req.params.id  // o id vem pela url

        // check if id is valid
        if(!ObjectId.isValid(id)) {  // se o id é um id valido
            res.status(422).json({ message: 'ID inválido!'})
            return
        }

        // check if pet exists
        const pet = await Pet.findOne({ _id: id })
        if(!pet) {
            res.status(404).json({ message: 'Pet não encontrado'})
            return
        }

        res.status(200).json({ pet: pet })
    }

    // remove a pet
    static async removePetById(req, res) {
        const id = req.params.id

        // check if id is valid
        if(!ObjectId.isValid(id)) {  // se o id é um id valido
            res.status(422).json({ message: 'ID inválido!'})
            return
        }

        // check if pet exists
        const pet = await Pet.findOne({ _id: id })
        if(!pet) {
            res.status(404).json({ message: 'Pet não encontrado'})
            return
        }

        

        // check if logged in user registered the pet, se o usuario logado cadastrou o pet, não posso deixar outro usuario deletar o pet dele
        const token = getToken(req)
        const user = await getUserByToken(token)

        //console.log(pet.user._id.toString())
        //console.log(user._id.toString())

        if(pet.user._id.toString() !== user._id.toString()) {
            res.status(422).json({ message: 'Houve um problema em processar a sua solicitação, tente novamente mais tarde!' })
            return
        }

        // sabendo que o pet é do usuario, podemos deletar
        // await Pet.findByIdAndRemove(id)  // na aula foi usado esse
        await Pet.findByIdAndDelete(id)

        res.status(200).json({ message: 'Pet removido com sucesso!' })
    }

    static async updatePet(req, res) {

        const id = req.params.id
        
        const { name, age, weight, color, available } = req.body

        const images = req.files

        const updateData = {}

        // check if pet exists
        const pet = await Pet.findOne({ _id: id })
        if(!pet) {
            res.status(404).json({ message: 'Pet não encontrado'})
            return
        }

        // check if logged in user registered the pet, se o usuario logado cadastrou o pet, não posso deixar outro usuario deletar o pet dele
        const token = getToken(req)
        const user = await getUserByToken(token)

        //console.log(pet.user._id.toString())
        //console.log(user._id.toString())

        if(pet.user._id.toString() !== user._id.toString()) {
            res.status(422).json({ message: 'Houve um problema em processar a sua solicitação, tente novamente mais tarde!' })
            return
        }

        // validations
        if (!name) {
            res.status(422).json({ message: 'O nome é obrigatório!' })
            return
        } else {
            updateData.name = name
        }

        if (!age) {
            res.status(422).json({ message: 'A idade é obrigatória!' })
            return
        } else {
            updateData.age = age
        }

        if (!weight) {
            res.status(422).json({ message: 'O peso é obrigatório!' })
            return
        } else {
            updateData.weight = weight
        }

        if (!color) {
            res.status(422).json({ message: 'A cor é obrigatória!' })
            return
        } else {
            updateData.color = color
        }

        if (images.length > 0) {
            updateData.images = []
            images.map((image) => {
                updateData.images.push(image.filename)
            })
        }

        /*if (images.length === 0) {
            res.status(422).json({ message: 'A imagem é obrigatória!' })
            return
        } else {
            updateData.images = []
            images.map((image) => {
                updateData.images.push(image.filename)
            })
        }*/

        await Pet.findByIdAndUpdate(id, updateData)

        res.status(200).json({ message: 'Pet atualizado com sucesso!'})
    }

    // schedule a visit
    static async schedule(req, res) {
        const id = req.params.id

        // check if pet exists
        const pet = await Pet.findOne({ _id: id })
        if(!pet) {
            res.status(404).json({ message: 'Pet não encontrado'})
            return
        }

        // check if user registered the pet, verificar se o pet é do proprio usuario
        const token = getToken(req)
        const user = await getUserByToken(token)

        if(pet.user._id.equals(user._id)) {
            res.status(422).json({ message: 'Você não pode agendar uma visita com o seu próprio pet!' })
            return
        }

        // check if user has scheduled a visit, ver se esse usuario que esta solicitando ja agendou uma visita
        if(pet.adopter) {
            if(pet.adopter._id.equals(user._id)) {
                res.status(422).json({ message: 'Você já agendou uma visita para esse Pet!'})
                return
            }
        }

        // add user to pet, adicionar esse usuário como adotante do pet
        pet.adopter = {
            _id: user._id,
            name: user.name,
            image: user.image
        }

        await Pet.findByIdAndUpdate(id, pet)

        res.status(200).json({ message: `A visita foi agendada com sucesso, entre em contato com ${pet.user.name} pelo telefone ${pet.user.phone}`,
        })  // pet.user.name, o usuario que cadastrou o pet
    }

    static async concludeAdoption(req, res) {
        const id = req.params.id

        // check if pet exists
        const pet = await Pet.findOne({ _id: id })
        if(!pet) {
            res.status(404).json({ message: 'Pet não encontrado'})
            return
        }

        // check if logged in user registered the pet
        const token = getToken(req)
        const user = await getUserByToken(token)

        if(pet.user._id.toString() !== user._id.toString()) {
            res.status(422).json({ message: 'Houve um problema em processar a sua solicitação, tente novamente mais tarde!' })
            return
        }

        pet.available = false  // não esta mais disponivel

        await Pet.findByIdAndUpdate(id, pet)  // pra atualizar o compo que concretiza que o pet não esta mais disponivel

        res.status(200).json({ message: 'Parabéns! O ciclo de adoção foi finalizado com sucesso!'})
    }
}