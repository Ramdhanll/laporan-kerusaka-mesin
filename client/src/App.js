import './App.css'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import LandingPage from './pages/LandingPage'
import Login from './pages/Login'
import Admin from './pages/Admin'
import { useContext, useEffect } from 'react'
import { AuthContext } from './contexts/Auth/AuthContext'
import AuthService from './services/AuthService'
import AdminRoute from './components/Admin/AdminRoute'
import HeadDivision from './pages/HeadDivision'
import HeadDivisionRoute from './components/HeadDivision/HeadDivisionRoute'
import StaffProductionRoute from './components/StaffProduction/StaffProductionRoute'
import StaffProduction from './pages/StaffProduction'
import PageNotFound from './pages/PageNotFound'
import StaffMechanicalRoute from './components/StaffMechanical/StaffMechanicalRoute'
import StaffMechanical from './pages/StaffMechanicical'

function App() {
   const { userState, userDispatch } = useContext(AuthContext)

   useEffect(() => {
      const revalidateUser = async () => {
         await AuthService.statusAuth(userDispatch)
      }
      revalidateUser()
   }, [userDispatch])

   useEffect(() => {
      if (typeof userState === 'object') {
         let root

         if (userState?.role === 'admin') {
            root = '/a'
         } else if (userState?.role === 'head_of_division') {
            root = '/h'
         } else if (userState?.role === 'production') {
            root = '/sp'
         } else if (userState?.role === 'mechanical') {
            root = '/sm'
         } else {
            root = '/404'
         }

         localStorage.setItem('root', root)
      }
   }, [userState])

   return (
      <div className='App'>
         <Router>
            <Switch>
               <Route path='/' component={LandingPage} exact />
               <Route path='/login' component={Login} />

               <AdminRoute path='/a' component={Admin} />
               <StaffProductionRoute path='/sp' component={StaffProduction} />
               <StaffMechanicalRoute path='/sm' component={StaffMechanical} />

               <HeadDivisionRoute path='/h' component={HeadDivision} />

               <Route path='/*' component={PageNotFound} exact />
            </Switch>
         </Router>
      </div>
   )
}

export default App
