import React, { useContext, useEffect } from 'react'
import { Redirect, Route } from 'react-router-dom'
import { AuthContext } from '../../../contexts/Auth/AuthContext'

const StaffMechanicalRoute = ({ component: Component, ...rest }) => {
   const { userState } = useContext(AuthContext)

   useEffect(() => {
      localStorage.setItem('urlCurrent', rest.location.pathname)
   }, [rest.location.pathname, userState])

   return (
      <Route
         {...rest}
         render={(props) =>
            userState?.role === 'mechanical' ? (
               <Component {...props} />
            ) : userState?.role === 'admin' ||
              userState?.role === 'head_of_division' ||
              userState?.role === 'production' ? (
               <Redirect to={localStorage.getItem('root') || '/'} />
            ) : (
               <Redirect to='/login' />
            )
         }
      />
   )
}

export default StaffMechanicalRoute
