import React, { createContext } from "react"

import useAuth from "../hooks/useAuth"

const Context = createContext();

// aqui vai criar um provedor, que vai dar esse contexto para as outras entidades
function UserProvider({ children }) {  // pegando a prop de children
  const { authenticated, register, logout, login } = useAuth();

  return (
    <Context.Provider
      value={{ authenticated, register, logout, login }}
    >
      {children}
    </Context.Provider>
  );
}

export { Context, UserProvider };