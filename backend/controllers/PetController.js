const Pet = require('../models/Pet')

// helpers
const getToken = require('../helpers/get-token')
const getUserByToken = require('../helpers/get-user-by-token')

module.exports = class PetController {

    // create a pet
    static async create(req, res) {
        const { name, age, weight, color } = req.body

        const available = true  // ela não vem do body, quando o pet for cadastrado ele tem que estar disponivel

        // images upload

        // validations
        if(!name) {
            res.status(422).json({ message: 'O nome é obrigatório!'})
            return
        }

        if(!age) {
            res.status(422).json({ message: 'A idade é obrigatória!'})
            return
        }

        if(!weight) {
            res.status(422).json({ message: 'O peso é obrigatório!'})
            return
        }

        if(!color) {
            res.status(422).json({ message: 'A cor é obrigatória!'})
            return
        }

        // get pet owner
        const token = getToken(req)
        const user = getUserByToken(token)

        // create a pet, em um objeto
        // const pet = new Pet(
        //     name,
        //     age,
        //     weight,
        //     available,
        //     images: [],
        //     user: {
        //         _id: user._id,
        //         name: user.name,
        //         image: user.image,
        //         phone: user.phone,
        //     },
        // )

    }
}