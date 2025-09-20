import { useContext,useState } from 'react';
import { authDataContext } from '../context/AuthContext.jsx';
import logo from '../assets/logo.svg';
import { BiSolidShow } from "react-icons/bi";
import { BiSolidHide } from "react-icons/bi";
import {useNavigate} from 'react-router-dom';
import axios from 'axios';
import { userDataContext } from '../context/UserContext.jsx';

function Signup() {
  
  let [view, setView] = useState(false)
  let navigate = useNavigate()
  let {serverUrl} = useContext(authDataContext)
  let {userData, setUserData} = useContext(userDataContext)

  //hooks for passing AuthContext data in signup function
  let [firstName, setFirstName] = useState("")
  let [lastName, setLastName] = useState("")
  let [userName, setUserName] = useState("")
  let [email, setEmail] = useState("")
  let [password, setPassword] = useState("")
  let [response, setResponse] = useState(null)
  let [error, setError] = useState("")
  let [loading, setLoading] = useState(false)

  
  //for handle signup 
  const handleSignup = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      let signupRes = await axios.post( serverUrl + '/api/auth/signup', {
        firstName,
        lastName,
        userName,
        email,
        password
      }, {
        withCredentials: true
      })
      setResponse(signupRes.data);
      console.log(signupRes)
      setUserData(signupRes.data)
      navigate('/')
      setLoading(false)
      //jab response mil jjayega to wapas se page blank ho jaayega
      setError('')
      setFirstName('')
      setLastName('')
      setUserName('')
      setEmail('')
      setPassword('')  
    } catch (error) {
      setError(error.response.data.message)
      setLoading(false)
      setResponse(null)  
    }
  }




  return (
    <div className="w-full h-screen bg-amber-100 flex flex-col items-center justify-start">
      
      <div className='p-[10px] lg:p-[20px] w-full'>
        <img src={logo} alt=''/>
      </div>

      <form className='bg-amber-200 w-[90%] max-w-[400px] h-[600px] mt-[20px] md:shadow-xl flex flex-col justify-center gap-[10px] p-[20px] rounded-[20px]'
       onSubmit={handleSignup}>
        <h1 className='text-gray-800 text-[30px] font-semibold mb-[20px]'>SignUp</h1>
        <input type='text' placeholder='firstname' required className='w-[100%] h-[40px] border-2 border-grey-600 text-grey-800 text-18px px-[10px] py-[20px] rounded-md' 
          value={firstName} onChange={(e) => setFirstName(e.target.value)} />
        <input type='text' placeholder='lastname' required className='w-[100%] h-[40px] border-2 border-grey-600 text-grey-800 text-18px px-[10px] py-[20px] rounded-md' 
          value={lastName} onChange={(e) => setLastName(e.target.value)} />
        <input type='text' placeholder='username' required className='w-[100%] h-[40px] border-2 border-grey-600 text-grey-800 text-18px px-[10px] py-[20px] rounded-md' 
          value={userName} onChange={(e) => setUserName(e.target.value)} />
        <input type='email' placeholder='email' required className='w-[100%] h-[40px] border-2 border-grey-600 text-grey-800 text-18px px-[10px] py-[20px] rounded-md' 
          value={email} onChange={(e) => setEmail(e.target.value)} />

        <div className='w-[100%] h-[40px] border-grey-600 text-grey-800 text-18px  rounded-md relative' >
          <input type={ view? "text":"password"} placeholder='password' required className='w-[100%] h-[40px] border-2 border-grey-600 text-grey-800 text-18px px-[10px] py-[20px] rounded-md' 
            value={password} onChange={(e) => setPassword(e.target.value)} />
          <span className='absolute right-[20px] top-[10px] text-[23px] cursor-pointer text-[#1919d2]' 
          onClick={()=> setView(prev => !prev)}> {view? <BiSolidShow/> : <BiSolidHide/> } </span>
        </div>
        
        {error && <p className='text-center text-red-500'> {error} </p>} 

        <button className='w-[100%] h-[50px] rounded-full bg-amber-400 mt-[20px] text-black font-semibold cursor-pointer'> {loading? 'Loading...' : 'SignUp'} </button>
        <p className='text-center mt-[5px] cursor-pointer' onClick={() => navigate("/login")} >Already have an account? <span className='text-[#1919d2]'> SignIn </span></p>
      </form>
    </div>
  )
}

export default Signup
