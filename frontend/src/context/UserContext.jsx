import { useState, useContext } from 'react'
import  { createContext } from 'react'
import { authDataContext } from './AuthContext.jsx'
import axios from 'axios'
import { useEffect } from 'react'

export const userDataContext = createContext()

function UserContext({children}) {
  let [userData, setUserData] = useState(null)
  let {serverUrl} = useContext(authDataContext)
  let [edit, setEdit] = useState(false)
  let [postData, setPostData] = useState([])

  const getCurrentUser = async () => {
    try {
      let result = await axios.get(serverUrl + "/api/user/currentuser",{
        withCredentials : true
      })
      setUserData(result.data)   
    } catch (error) {
      console.log(error)
      setUserData(null)
    }
  }


  const getPost = async () => {
    try {
      let postResult = await axios.get(serverUrl + "/api/post/getpost", {
        withCredentials: true})
        console.log(postResult)
        setPostData(postResult.data)
    } catch (error) {
      console.log(error)
    }
  }


  useEffect(() => {
    getCurrentUser(),
    getPost()
  }, [])

  const value = { userData, setUserData, edit, setEdit, postData, setPostData, getPost }

  return (
    <div>
      <userDataContext.Provider value ={ value }>
        {children}
      </userDataContext.Provider>
    </div>
  )
}

export default UserContext
