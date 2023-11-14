const getToken = (req) => {
    const authHeader = req.headers.authorization
    // quando tiver um espaço vai criar um array e pegar a segunda parte indice [1] e enviar só o token
    const token = authHeader.split(' ')[1]

    return token
}

module.exports = getToken