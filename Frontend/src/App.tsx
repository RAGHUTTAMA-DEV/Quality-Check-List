import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './App.css'
import Signup from './pages/SignUp'
import Login from './pages/login/Login'
import { AuthProvider } from './hooks/AuthContext'
import PrivateProvider from './PrivateRouter'
import DashBoard from './pages/DashBoard'
import UserTable from './pages/admin/UserTable'
import CheckList from './pages/Checklist/CheckList'
import CheckListForm from './pages/Checklist/CheckListForm'
import ItemsGet from './pages/items/itemsGet'
import ItemsUpdate from './pages/items/UpdatingItems'

import UserDash from './pages/UserDash'
import Demo from './pages/demo'
import ML from './pages/ml'
import ImagePredictor from './pages/ImageUpload'
import AdminDashboard from './pages/Adarsh'

function App() {
  return (
    <div>
      
      <BrowserRouter>
        <AuthProvider>
          <Routes>
           
            <Route path='/signup' element={<Signup />} />
            <Route path='/login' element={<Login />} />
            <Route path='/' element={<DashBoard />} />

            {/* <Route path='/checklist' element={<ChecklistManagement />} /> */}
            {/* Add more routes as needed */}
            <Route path='/users' element={<UserTable/>}/>
            <Route path='/checkList' element={<CheckList/>}/>
            <Route path='/checkList/update' element={<CheckListForm/>}/>
            <Route path='/items' element={<ItemsGet/>}/>
            <Route path='/items/update' element={<ItemsUpdate/>}/>
          
            <Route path='userC' element={<UserDash/>}/>
            <Route path='/ml' element={<ML/>}/>
            <Route path='/image' element={<ImagePredictor/>}/>
            <Route path='/admin' element={<AdminDashboard/>}/>
            
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </div>
  )
}

export default App
