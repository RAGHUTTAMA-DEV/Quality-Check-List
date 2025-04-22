import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Signup from './pages/SignUp'

function App() {
  const [count, setCount] = useState(0)

   return(
    <div>
      <h1 className='text-amber-900'>hi</h1>
      <Signup/>
    </div>
   )
  
}

export default App
