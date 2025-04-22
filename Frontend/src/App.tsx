import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Signup from './pages/SignUp'
import Login from './pages/login/Login'
import { BrowserRouter,Routes,Route } from 'react-router-dom'

function App() {
  const [count, setCount] = useState(0)

   return(
    <div>
      <BrowserRouter>
       <Routes>
            <Route path='/login' element={<Login/>}/>
            <Route path='/' element={<Signup/>}/>
            <Route path='/signup' element={<Signup/>}/>
       </Routes>
      </BrowserRouter>
      
    </div>
   )
  
}

export default App
