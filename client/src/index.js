import React from 'react'
import ReactDOM from 'react-dom'
import './index.css'
import App from './App'
import reportWebVitals from './reportWebVitals'
import { ChakraProvider } from '@chakra-ui/react'
import { SWRConfig } from 'swr'
import axios from 'axios'
import theme from './chakra/theme'
import { AuthContextProvider } from './contexts/Auth/AuthContext'

axios.defaults.withCredentials = true
axios.defaults.baseURL = 'http://localhost:5000'

ReactDOM.render(
   <React.StrictMode>
      <ChakraProvider theme={theme}>
         <SWRConfig
            value={{
               revalidateOnFocus: true,
               fetcher: (url) => axios.get(url).then((res) => res.data),
            }}
         >
            <AuthContextProvider>
               <App />
            </AuthContextProvider>
         </SWRConfig>
      </ChakraProvider>
   </React.StrictMode>,
   document.getElementById('root')
)

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals()
