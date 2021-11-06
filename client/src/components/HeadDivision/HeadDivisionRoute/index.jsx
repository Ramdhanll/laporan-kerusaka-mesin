import React, { useContext, useEffect } from 'react'
import { Redirect, Route } from 'react-router-dom'
import { AuthContext } from '../../../contexts/Auth/AuthContext'

const HeadDivisionRoute = ({ component: Component, ...rest }) => {
   const { userState } = useContext(AuthContext)
   useEffect(() => {
      localStorage.setItem('urlCurrent', rest.location.pathname)
   }, [rest.location.pathname])

   return (
      <Route
         {...rest}
         render={(props) =>
            userState?.role === 'head_of_division' ? (
               <Component {...props} />
            ) : userState?.role === 'admin' ||
              userState?.role === 'production' ||
              userState?.role === 'mechanical' ? (
               <Redirect to={localStorage.getItem('root') || '/'} />
            ) : (
               <Redirect to='/login' />
            )
         }
      />
   )
}

export default HeadDivisionRoute
