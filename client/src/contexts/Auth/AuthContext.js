import { createContext, useEffect, useReducer } from 'react'
import AuthReducer from './AuthReducer'

const initialAuthState = {
   userState: localStorage.getItem('user') || null,
}

export const AuthContext = createContext(initialAuthState)

export const AuthContextProvider = ({ children }) => {
   const [state, dispatch] = useReducer(AuthReducer, initialAuthState)
   useEffect(() => {
      localStorage.setItem('user', JSON.stringify(state.userState))
   }, [state.userState])

   return (
      <AuthContext.Provider
         value={{ userState: state.userState, userDispatch: dispatch }}
      >
         {children}
      </AuthContext.Provider>
   )
}
