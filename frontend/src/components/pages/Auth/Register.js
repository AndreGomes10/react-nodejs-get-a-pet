import Input from '../../form/Inputt'
import { Link } from 'react-router-dom'

import { useContext, useState } from 'react'  // ele ja é considerado um hook

import styles from '../../form/Form.module.css'

/* context */
import { Context } from '../../../context/UserContext'

function Register() {

  const [user, setUser] = useState({})  // passar o estado inicial do usuario, um objeto vazio
  const {register} = useContext(Context)

  function handleChange(e) {   // funcao para capturar o objeto atual que ja tem e adicionar uma nova propriedade
    setUser({ ...user, [e.target.name]: e.target.value })  // e.target.value, pra acessar o valor que esta sendo digitado nesse input, 
                                                           // cada vez que muda uma letra no input, ja vai mudando a letra na propriedade
                                                           // e assim vai formando o objeto do usuario pra enviar pro backend
  }

  // vai ser executado baseado no formulario, quando o formulario for submetido
  function handleSubmit(e) {
    e.preventDefault()  // pra parar a executação do formulario senão ele vai dar um  page reload
    // console.log(user);

    // ENVIAR O USUARIO PARA O BANCO
    register(user)
  }

  return (
    <section className={styles.form_container}>
      <h1>Registrar</h1>
      <form onSubmit={handleSubmit}>
        <Input
          text="Nome"
          type="text"
          name="name"
          placeholder="Digite o seu nome"
          handleOnChange={handleChange}
        />
        <Input
          text="Telefone"
          type="text"
          name="phone"
          placeholder="Digite o seu telefone"
          handleOnChange={handleChange}
        />
        <Input
          text="E-mail"
          type="email"
          name="email"
          placeholder="Digite o seu e-mail"
          handleOnChange={handleChange}
        />
        <Input
          text="Senha"
          type="password"
          name="password"
          placeholder="Digite a sua senha"
          handleOnChange={handleChange}
        />
        <Input
          text="Confirmação de senha"
          type="password"
          name="confirmpassword"
          placeholder="Confirme a sua senha"
          handleOnChange={handleChange}
        />
        <input type="submit" value="Cadastrar" />
      </form>
      <p>
        Já tem conta? <Link to="/login">Clique aqui.</Link>
      </p>
    </section>
  )
}

export default Register