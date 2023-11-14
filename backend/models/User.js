const mongoose = require('../db/conn')
const { Schema } = mongoose

const User = mongoose.model(
    'User',
    new Schema({
        name: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true
        },
        password: {
            type: String,
            required: true
        },
        image: {
            type: String
        },
        phone: {
            type: String,
            required: true
        },
    },
    /* 
    timestamps, vai criar duas colunas novas(createdAt e updatedAt), toda vez que o registro for criado
    ele vai marcar uma data, e toda vez que o registro for atualizado ele vai alterar essa data da coluna updatedAt
    */
    { timestamps: true },
    ),
)

module.exports = User