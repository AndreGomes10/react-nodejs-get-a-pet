const jwt = require("jsonwebtoken");

// middleware to validate token
const checkToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) return res.status(401).json({ message: "Acesso negado!" });

  try {
    const verified = jwt.verify(token, "nossosecret");
    req.user = verified;
    next(); // to continue the flow
  } catch (err) {
    res.status(400).json({ message: "O Token é inválido!" });
  }
};

module.exports = checkToken;

/*const jwt = require('jsonwebtoken')
const getToken = require('./get-token')

// middleware to validate token
const checkToken = (req, res, next) => {

    if(!req.headers.authorization){  // se não vem nada no authorization
        return res.status(401).json({message: 'Acesso Negado!'})
    }

    const token = getToken(req)

    if(!token) {
        return res.status(401).json({message: 'Acesso Negado!'})
    }

    try {
        // fazer uma verificação de token
        const verify = jwt.verify(token, 'nossosecret')
        req.user = verify
        next()
    } catch (error) {
        return res.status(400).json({message: 'Token inválido'})
    }
}

module.exports = checkToken
*/