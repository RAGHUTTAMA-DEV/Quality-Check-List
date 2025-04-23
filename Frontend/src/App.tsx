import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './App.css'
import Signup from './pages/SignUp'
import Login from './pages/login/Login'
import { AuthProvider } from './hooks/AuthContext'
import PrivateProvider from './PrivateRouter'
import DashBoard from './pages/DashBoard'
import Demo from './pages/demo'
function App() {
  return (
    <div>
      <BrowserRouter>
        <AuthProvider>
          <Routes>
           
            <Route path='/signup' element={<Signup />} />
            <Route path='/login' element={<Login />} />
            <Route path='/' element={<DashBoard />} />
            {/* Add your CheckList-Management route here, for example: */}
            {/* <Route path='/checklist' element={<ChecklistManagement />} /> */}
            <Route path='/demo' element={<Demo />} />
            <Route path='/checklist' element={<PrivateProvider><Signup /></PrivateProvider>} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </div>
  )
}

export default App
