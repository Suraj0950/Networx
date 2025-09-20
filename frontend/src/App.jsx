import { Routes, Route, Navigate } from 'react-router-dom'
import Home from './pages/Home.jsx'
import Signup from './pages/Signup.jsx'
import Login from './pages/Login.jsx'
import { useContext } from 'react'
import { userDataContext } from './context/UserContext.jsx'

function App() {
  let {userData} = useContext(userDataContext)
  return (
    <Routes>
      <Route path='/' element={ userData? <Home/> : <Navigate to = '/login'/> }/>
      <Route path='/signup' element={ userData? <Navigate to = '/'/> : <Signup/>}/>
      <Route path='/login' element={ userData? <Navigate to = '/'/> : <Login/>}/>
    </Routes>
  )
}
export default App
