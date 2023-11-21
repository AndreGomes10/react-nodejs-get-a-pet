const mongoose = require('../db/conn')
const { Schema } = mongoose

const Pet = mongoose.model(
    'Pet',
    new Schema({
        name: {
            type: String,
            required: true,
        },
        age: {
            type: Number,
            required: true
        },
        weight: {
            type: Number,
            required: true
        },
        color: {
            type: String,
            required: true
        },
        images: {
            type: Array,
            required: true
        },
        available: {
            type: Boolean
        },
        user: Object,  // o usuario
        adopter: Object  // quem adotou, informações de quem adotou o pet
    },
    /* 
    timestamps, vai criar duas colunas novas(createdata e updatedata), toda vez que o registro for criado
    ele vai marcar uma data, e toda vez que o registro atualizado ele vai alterar essa data da coluna update date
    */
    { timestamps: true },
    ),
)

module.exports = Pet