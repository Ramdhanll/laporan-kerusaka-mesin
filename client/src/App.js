import './App.css'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import LandingPage from './pages/LandingPage'
import Login from './pages/Login'
import Admin from './pages/Admin'
import { useContext, useEffect } from 'react'
import { AuthContext } from './contexts/Auth/AuthContext'
import AuthService from './services/AuthService'
import AdminRoute from './components/Admin/AdminRoute'

function App() {
   const { userDispatch } = useContext(AuthContext)

   useEffect(() => {
      const revalidateUser = async () => {
         await AuthService.statusAuth(userDispatch)
      }
      revalidateUser()
   }, [userDispatch])

   return (
      <div className='App'>
         <Router>
            <Switch>
               <Route path='/' component={LandingPage} exact />
               <Route path='/login' component={Login} />

               <AdminRoute path='/a' component={Admin} />
            </Switch>
         </Router>
      </div>
   )
}

export default App
