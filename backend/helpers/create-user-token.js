const jwt = require('jsonwebtoken')

// create a token
const createUserToken = async (user, req, res) => {
    const token = jwt.sign({
        name: user.name,
        id: user._id
    }, "nossosecret")  // nossosecret fortificar o jwt, deixar o token unico

    // return token
    res.status(200).json({
        message: 'Você está autenticado',
        token: token,
        userId: user._id
    })
}

module.exports = createUserToken