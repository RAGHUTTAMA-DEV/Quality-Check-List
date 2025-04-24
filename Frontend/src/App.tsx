import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './App.css'
import Signup from './pages/SignUp'
import Login from './pages/login/Login'
import { AuthProvider } from './hooks/AuthContext'
import PrivateProvider from './PrivateRouter'
import DashBoard from './pages/DashBoard'
import UserTable from './pages/admin/UserTable'
import CheckList from './pages/Checklist/CheckList'
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
            {/* Add more routes as needed */}
            <Route path='/users' element={<PrivateProvider roles={['admin','operator']} ><UserTable/></PrivateProvider>} />
            <Route path='/checkList' element={<CheckList/>}/>
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </div>
  )
}

export default App
