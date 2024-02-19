import { Link } from 'react-router-dom'
import React, { useContext } from 'react'

import styles from './Navbar.module.css'

import Logo from '../../assets/img/logo.png'

/* contexts */
import { Context } from '../../context/UserContext'

/* hooks */

function Navbar() {
  const { authenticated, logout } = useContext(Context)

  return (
    <nav className={styles.navbar}>
      <div className={styles.navbar_logo}>
        <img src={Logo} alt="Get A Pet" />
        <h2>Get A Pet</h2>
      </div>
      <ul>
        <li>
          <Link to="/">Adotar</Link>
        </li>
        {authenticated ? (
          <>
          <li>
              <Link to="/user/profile">Perfil</Link>
            </li>
            <li>
            <Link onClick={logout}>Sair</Link>
            </li>
          </>
        ) : (
          <>
            <li>
              <Link to="/login">Entrar</Link>
            </li>
            <li>
              <Link to="/register">Cadastrar</Link>
            </li>
          </>
        )}
      </ul>
    </nav>
  )
}

export default Navbar


/* <>, tem que colocar p não dar erro */