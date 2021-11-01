import React, { useContext, useEffect } from 'react'
import { Redirect, Route } from 'react-router-dom'
import { AuthContext } from '../../../contexts/Auth/AuthContext'

const AdminRoute = ({ component: Component, ...rest }) => {
   const { userState } = useContext(AuthContext)
   useEffect(() => {
      localStorage.setItem('urlCurrent', rest.location.pathname)
   }, [rest.location.pathname])

   return (
      <Route
         {...rest}
         render={(props) =>
            userState?.role === 'admin' ? (
               <Component {...props} />
            ) : userState?.role === 'student' ||
              userState?.role === 'teacher' ? (
               <Redirect to={localStorage.getItem('root') || '/'} />
            ) : (
               <Redirect to='/login' />
            )
         }
      />
   )
}

export default AdminRoute
