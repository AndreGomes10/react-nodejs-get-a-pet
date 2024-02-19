import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'

/* components */
import Navbar from './components/layout/Navbar'
import Footer from './components/layout/Footer'
import Container from './components/layout/Container'

/* pages */
import Home from './components/pages/Home'
import Login from './components/pages/Auth/Login'
import Register from './components/pages/Auth/Register'
import Message from './components/layout/Message'

/* context */
import { UserProvider } from './context/UserContext'
import Profile from './components/pages/User/Profile'

function App() {
  return (
    <Router>
      <UserProvider>  {/* o UserProvider esta abraçando tudo, então agora todos os componentes tem a possibilidade de acessar o contexto do usuario */}
        <Navbar />
        <Message />
        {/*<Navbar /> /* ele vai ser responsavel por trocar de pagina */}
        <Container>
        <Routes>
          <Route path='/login' element={<Login />} />
            
          <Route path='/register' element={<Register />} />

          <Route path='/user/profile' element={<Profile />} />
            
          <Route path='/' element={<Home />} />
            
        </Routes>
        </Container>
        <Footer />
      </UserProvider>
    </Router>
  );
}

export default App;