const User = require('../models/User')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

// helpers
const createUserToken = require('../helpers/create-user-token')
const getToken = require('../helpers/get-token')
const getUserByToken = require('../helpers/get-user-by-token')

module.exports = class UserController {

    // REGISTER
    static async register(req, res) {
        const { name, email, phone, password, confirmpassword } = req.body

        // validations
        if (!name) {
            res.status(422).json({ message: 'O nome é obrigatório' })
            return
        }
        if (!email) {
            res.status(422).json({ message: 'O e-mail é obrigatório' })
            return
        }
        if (!phone) {
            res.status(422).json({ message: 'O telefone é obrigatório' })
            return
        }
        if (!password) {
            res.status(422).json({ message: 'A senha é obrigatória' })
            return
        }
        if (!confirmpassword) {
            res.status(422).json({ message: 'A confirmação é obrigatória' })
            return
        }

        if (password !== confirmpassword) {
            res.status(422).json({ message: 'A senha e a confirmação tem que ser iguais!' })
            return
        }

        // check if user exists
        const userExists = await User.findOne({ email: email })  // vai buscar no banco se tem o email cadastrado no sistema
        if (userExists) {
            res.status(422).json({ message: 'Por favor, utilize outro e-mail!' })
            return
        }

        // create a password
        const salt = await bcrypt.genSalt(12)  // pra dificultar a senha
        const passwordHash = await bcrypt.hash(password, salt)  // aqui vai ter uma super senha

        const user = new User({
            name,
            email,
            phone,
            password: passwordHash
        })

        try {
            const newUser = await user.save()

            await createUserToken(newUser, req, res)
        } catch (error) {
            res.status(500).json({ message: error })
        }
    }

    // LOGIN
    static async login(req, res) {
        const { email, password } = req.body

        if (!email) {
            res.status(422).json({ message: 'O e-mail é obrigatório' })
            return
        }
        if (!password) {
            res.status(422).json({ message: 'A senha é obrigatória' })
            return
        }

        // check if user exists
        const user = await User.findOne({ email: email })  // vai buscar no banco se tem o email cadastrado no sistema
        if (!user) {
            res.status(422).json({ message: 'Não há usuário cadastrado com este e-mail!' })
            return
        }

        // check if password match with db password
        const checkPassword = await bcrypt.compare(password, user.password)  // passando a senha do frontend e comparar

        if (!checkPassword) {
            res.status(422).json({ message: 'Senha inválida!' })
            return
        }

        await createUserToken(user, req, res)
    }

    // pegar o usuario que esta usando o sistema atualmente
    static async checkUser(req, res) {
        let currentUser

        //console.log(req.headers.authorization)

        if (req.headers.authorization) {
            const token = getToken(req)
            const decoded = jwt.verify(token, 'nossosecret')  // verify, retorna um objeto com todas as propriedades que enviei

            currentUser = await User.findById(decoded.id)

            currentUser.password = undefined  //undefined, vai remover a senha do retorno

        } else {
            currentUser = null
        }

        res.status(200).send(currentUser)
    }

    // atualização do usuario
    static async getUserById(req, res) {
        const id = req.params.id
        
        try{
            const user = await User.findById(id)
            res.status(200).json({ user })
        }
        catch (error){
            res.status(422).json({message: 'Usuário não encontrado!'})

            return
        }
    }

    // PROTEÇÃO DA ROTA
    // fazer que essa rota só funcione se o usuario tiver o token, essa vai ser a proteção da rota
    static async editUser(req, res) {
        const id = req.params.id

        // check if user exists
        const token = getToken(req)
        const user = await getUserByToken(token)

        const {name, email, phone, password, confirmpassword} = req.body

        let image = ''

        if(req.file) {
            user.image = req.file.filename  // o multer ja vai alterar o nome da imagem aqui na req
        }

        // validations
        if (!name) {
            res.status(422).json({ message: 'O nome é obrigatório' })
            return
        }
        user.name = name
        
        if (!email) {
            res.status(422).json({ message: 'O e-mail é obrigatório' })
            return
        }

        // check if email has already token
        const userExists = await User.findOne({email: email})

        if(user.email !== email && userExists){
            res.status(422).json({message: 'Por favor, utilize outro e-mail!'})
        }
        user.email = email


        if (!phone) {
            res.status(422).json({ message: 'O telefone é obrigatório' })
            return
        }
        user.phone = phone

        if(password != confirmpassword) {
            res.status(422).json({message: "As senhas não conferem!"})
            return
        } else if(password === confirmpassword && password !=  null) {
            // create a password
        const salt = await bcrypt.genSalt(12)  // pra dificultar a senha
        const passwordHash = await bcrypt.hash(password, salt)  // aqui vai ter uma super senha

        user.password = passwordHash
        }

        try {
            // return user update data
            const updateUser = await User.findByIdAndUpdate(
                { _id: user._id },  // atualizar pelo id, ele é o filtro
                { $set: user },  // quais dados vão ser atualizados
                { new: true },  // pra fazer a atualização dos dados com sucesso
                res.status(200).json({ message: 'Usuário atualizado com secesso!'})
            )
        } catch (error) {
            res.status(500).json({ message: error})
            return
        }

    }
}


/*
    // atualização do usuario
    static async getUserById(req, res) {
        const id = req.params.id
        //const id = mongoose.Types.ObjectId(req.params.id)
        //const user = await User.findById(id).select('-pass')  // id que veio da url
        const user = await User.findById(id, {password: false})  // retorna todos os campos, exceto o campo password

        // if (id.length != 24) {
        //     res.status(422).json({ message: 'Id inválido' })
        //     return
        // }
        
        const user = await User.findById(id)

        if (!user) {
            res.status(422).json({message: 'Usuário não encontrado!'})

            return
        }
        res.status(200).json({ user })
    }
    */