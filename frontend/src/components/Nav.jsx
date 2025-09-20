import Logo from "../assets/linkedin.png"
import { IoSearchSharp } from "react-icons/io5";
import { TiHome } from "react-icons/ti";
import { FaUserGroup } from "react-icons/fa6";
import { IoNotifications } from "react-icons/io5";
import profile from '../assets/profile.png'
import { useContext, useState } from "react";
import { userDataContext } from "../context/UserContext.jsx";
import { authDataContext } from "../context/AuthContext.jsx";
import axios from "axios";
import { Navigate, useNavigate} from 'react-router-dom'

function Nav() {
    let [activeSearch, setActiveSearch] = useState(false)
    let {userData, setUserData} = useContext(userDataContext)
    let [viewPopup, setViewPopup] = useState(false)
    let {serverUrl} = useContext(authDataContext)
    let Navigate = useNavigate()

    const handleSignOut = async() => {
        try {
            let signOutRes = await axios.get(serverUrl + "/api/auth/logout", {withCredentials:true})
            setUserData(null)
            Navigate("/login")
            console.log(signOutRes);   
        } catch (error) {
            console.log(error)    
        }
    }

  return (
    <div className='w-full h-[60px] bg-[white] fixed top-0 shadow-lg flex md:justify-around justify-between items-center px-[10px] left-0  cursor-pointer'>
    
      <div className="flex justify-center items-center gap-[10px] ">
            <div onClick={()=>{
                setActiveSearch(false)
             }}>
              <img src={Logo} alt='logo' className="w-[45px]"/>
            </div>
            
            {!activeSearch && <div> <IoSearchSharp className="w-[25px] h-[25px] text-gray-600 lg:hidden" 
            onClick={()=> setActiveSearch(true)}/></div>}
            
            <form className = {`w-[200px] lg:w-[350px] h-[40px] bg-[#e4e4e4] lg:flex items-center gap-[10px] px-[10px] py-[5px] rounded-full 
                ${!activeSearch? "hidden" :"flex"}`}>

                <div> <IoSearchSharp className="w-[25px] h-[25px] text-gray-600"/> </div>
                <input type="text" className="w-[80%] h-[full] bg-transparent outline-none border-0"
                placeholder="Search users"/>
            </form>
      </div>

        
        <div className="flex justify-center items-center gap-[20px] relative ">

            {viewPopup && <div className="w-[300px] min-h-[300px] rounded bg-[white] shadow-lg absolute
             top-[65px] flex flex-col items-center p-[20px] gap-[20px] right-2 ">
                <div  className="w-[55px] h-[55px] rounded-full overflow-hidden">
                    <img src={userData.profileImage || profile} alt="dp"/></div>
                    <div className="text-[18px] font-semibold text-gray-700">{`${userData.firstName} ${userData.lastName}`}</div>
                    <button className=" w-full h-[40px] border-2 rounded-full border-[#2ea2e6] text-[#2ea2e6] cursor-pointer"> View Profile </button>
                    <div className="w-full h-[1px] bg-gray-300"></div>

                    <div className="flex  w-full justify-start items-center text-gray-600 gap-[10px]">
                    <FaUserGroup className="w-[22px] h-[23px] text-gray-600 " />
                    <div>My Network</div>
               </div>
               <button className=" w-full h-[40px] border-2 rounded-full border-[#f00a0a] text-[#f00a0a] cursor-pointer"
               onClick={handleSignOut}> Sign Out </button>

            </div> }

                
            <div className="lg:flex flex-col items-center justify-center text-gray-600 hidden">
                <TiHome className="w-[22px] h-[22px] text-gray-600 " />
                <div>Home</div>
            </div>
            
            <div className="lg:flex flex-col items-center justify-center text-gray-600 hidden">
                <FaUserGroup className="w-[22px] h-[23px] text-gray-600" />
                <div>My Network</div>
            </div>

            <div className="flex flex-col items-center justify-center text-gray-600">
                < IoNotifications className="w-[22px] h-[23px] text-gray-600" />
                <div className="hidden md:block">Notifications</div>
            </div>

            <div  className="w-[43px] h-[43px] rounded-full overflow-hidden cursor-pointer" 
             onClick={()=> setViewPopup(prev => !prev)}>
                <img src={userData.profileImage || profile} alt="dp"/>
            </div>
        </div>

    </div>
  )
}

export default Nav
