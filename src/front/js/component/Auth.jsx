import React, { createContext, useContext, useState } from "react"
import { useNavigate } from "react-router-dom"

const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const navigate = useNavigate()

  const login = (userData) => {
    setUser(userData)
    // store the user data in localStorage or a secure cookie
  }

  const logout = () => {
    setUser(null)
    // clear the user data from localStorage or the secure cookie
    navigate("/login")
  }

  return <AuthContext.Provider value={{ user, login, logout }}>{children}</AuthContext.Provider>
}

export const useAuth = () => useContext(AuthContext)

