// Aqui vai fazer chamadas na API pra tratar da altenticação, é um arquivo de função e autenticação

// API
import api from '../utils/api'

import { useState, useEffect } from 'react'
//import { useHistory } from 'react-router-dom'  // pra manipular a url que acessamos, fazer o usuario ir pra uma url qualquer, tipo a home
import { useNavigate } from 'react-router-dom'  // atualização do useHistory, pra manipular a url que acessamos, fazer o usuario ir pra uma url qualquer, tipo a home
import useFlashMessage from './useFlashMessage'

export default function useAuth() {

    const [authenticated, setAuthenticated] = useState(false)  // ele começa como false, o usuario nunca esta autenticado
    const {setFlashMessage} = useFlashMessage()
    //const history = useHistory()
    const navigate = useNavigate()

    // inserir o token diretamente na nossa api automaticamente quando o usuario acessa uma pagina, vai fazer a verificação do token
    // uma vez e não ter que ficar reinserindo o token toda hora
    useEffect(() => {
        const token = localStorage.getItem('token')
    
        if (token) {
          api.defaults.headers.Authorization = `Bearer ${JSON.parse(token)}`
          setAuthenticated(true)
        }
    
        //setLoading(false)
      }, [])

    async function register(user) {

        let msgText = 'Cadastro realizado com sucesso!'
        let msgType = 'success'

        try {
            // essa é a rota que esta declarada no backend cadastrar usuarios, esta mandando o post pra la
            const data = await api.post('/users/register', user).then((response) => {
                return response.data
            })
            await authUser(data)
        } catch (error) {
            // tratar erro
            msgText = error.response.data.message
            msgType = 'error'
        }

        setFlashMessage(msgText, msgType)
    }
    
    
      async function authUser(data) {
        setAuthenticated(true)
        localStorage.setItem('token', JSON.stringify(data.token))  // o token que vem da requisição

        navigate('/')
        //history.push('/')
        
      }

      async function login(user) {
        let msgText = 'Login realizado com sucesso!'
        let msgType = 'success'
    
        try {
          const data = await api.post('/users/login', user).then((response) => {
            return response.data
          })
    
          await authUser(data)
        } catch (error) {
          // tratar erro
          msgText = error.response.data.message
          msgType = 'error'
        }
    
        setFlashMessage(msgText, msgType)
      }

      function logout() {
        const msgText = 'Logout realizado com sucesso!'
        const msgType = 'success'
    
        setAuthenticated(false)
        localStorage.removeItem('token')
        api.defaults.headers.Authorization = undefined
        navigate('/login')
        //history.push('/login')
    
        setFlashMessage(msgText, msgType)
      }
    
      return { authenticated, register, logout, login }
}