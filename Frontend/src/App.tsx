import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './App.css'
import Signup from './pages/SignUp'
import Login from './pages/login/Login'
import { AuthProvider } from './hooks/AuthContext'

function App() {
  return (
    <div>
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path='/signup' element={<Signup />} />
            <Route path='/login' element={<Login />} />
            <Route path='/' element={<Signup />} />
            {/* Add your CheckList-Management route here, for example: */}
            {/* <Route path='/checklist' element={<ChecklistManagement />} /> */}
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </div>
  )
}

export default App
