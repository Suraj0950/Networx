import Nav from "../components/Nav.jsx"
import profile from '../assets/profile.png'
import { FaPlus } from "react-icons/fa6"
import { IoCameraOutline } from "react-icons/io5"
import { ImPencil } from "react-icons/im"
import { useContext, useRef, useState } from "react"
import { userDataContext } from "../context/UserContext.jsx"
import EditProfile from "../components/EditProfile.jsx"
import { RxCross2 } from "react-icons/rx";
import { BsImage } from "react-icons/bs"; 
import { authDataContext } from "../context/AuthContext.jsx"
import axios from "axios"
import Post from "../components/Post.jsx"


function home() {

  let {userData, setUserData, edit, setEdit, postData, setPostData} = useContext(userDataContext)
  let {serverUrl} = useContext(authDataContext)
  let [frontendImg, setFrontendImg] = useState("")
  let [backendImg, setBackendImg] = useState("")
  let [description, setDescription] = useState("")
  let image = useRef()
  let [uploadPost, setUploadPost] = useState(false)
  let [posting, setPosting ] = useState(false)

  function handleImage(e) {
    let file = e.target.files[0]
    setBackendImg(file)
    setFrontendImg(URL.createObjectURL(file))
  }

  async function handleUploadPost() {
    setPosting(true)
    try {
      let formdata = new FormData()
      formdata.append("description", description)
      if(backendImg){
        formdata.append("image", backendImg)
      }
      let resPost = await axios.post(serverUrl + "/api/post/create", formdata, {withCredentials:true})
      console.log(resPost)
      setPosting(false)
      setUploadPost(false)
    } catch (error) {
      setPosting(false)
      console.log(error)
    }
  }

  return (
      {/* MAIN DIV */}  ,  
    <div className='w-full min-h-[100vh] bg-amber-100 pt-[80px] flex items-start justify-center gap-[20px] px-[18px] flex-col lg:flex-row pb-[50px]'>
      {edit && <EditProfile/>}
      

      {/* LEFT-SIDE DIV */}
      <div className="w-full lg:w-[25%] min-h-[200px]  bg-[white] shadow-lg rounded-lg p-[8px] relative">
        <div className="w-[100] h-[100px] bg-[#e3d7d7] rounded overflow-hidden flex items-center justify-center cursor-pointer"
        onClick = {() => setEdit(true)}>
          <img src={userData.coverImage || ""} alt="" className="w-full"/>
          <IoCameraOutline className="h-[22px] w-[27px] text-gray-800 absolute top-[20px] right-[20px]"/>
        </div>
        <div className="w-[43px] h-[43px] overflow-hidden rounded-full flex items-center justify-centre absolute top-[80px] left-[24px] cursor-pointer"
        onClick = {() => setEdit(true)}><img src={ userData.profileImage || profile} alt="dp" className=" h-full "/>
        </div>
        <div className=" text-[13px] bg-[#388aed] rounded-full text-[white] absolute bottom-[145px] left-[55px] flex justify-center items-center cursor-pointer"
        onClick = {() => setEdit(true)}><FaPlus/></div>
        <div className="mt-[20px] pl-[10px]">
          <div className="font-semibold">{`${userData.firstName} ${userData.lastName}`}</div>
          <div>{userData.headline || ""}</div>
          <div className="text-[14px]">{userData.location}</div>  
        </div>
        <button className=" w-full h-[40px] mt-[20px] border-2 rounded-full border-[#2ea2e6] text-[#2ea2e6] cursor-pointer flex items-center justify-center gap-[10px]" 
        onClick = {() => setEdit(true)}><ImPencil/> Edit Profile </button>
      </div>

      {/* // Navbar */}
      <Nav/>

      {/* Post popup wala div ke piche halka black */}
      { uploadPost && <div className="w-[100%] h-[100%] bg-black z-[100] absolute top-0 opacity-[0.5] left-0"></div>}

      {/* Post Popup Div*/}
      { uploadPost && <div className="w-[90%] max-w-[420px] h-[550px]  bg-white absolute z-[200] rounded-lg  shadow-lg p-[20px] overflow-hidden">
        <div className=" absolute top-[10px] right-[10px]" 
         onClick={()=> setUploadPost(false)}><RxCross2  className=" text-red-600 font-bold w-[25px] h-[25px] cursor-pointer"/>
        </div>

        <div className="flex items-center justify-start gap-[10px]">
          <div className="w-[43px] h-[43px] overflow-hidden rounded-full flex items-center justify-centre  top-[24px] left-[24px] cursor-pointer">
            <img src={ userData.profileImage || profile} alt="dp" className=" h-full "/>
          </div>
          <div className="font-semibold">{`${userData.firstName} ${userData.lastName}`}</div>
        </div>

        <textarea className=" w-full h-[200px] outline-none border-none resize-none p-[10px] bg-amber-100 rounded-lg mt-[10px]" 
          placeholder="What do want to talk about ?" 
          value={description} onChange={(e) => setDescription(e.target.value)}>
        </textarea>
        

        <input type="file" ref={image} onChange={handleImage} hidden />
        <div  className="w-[100%] h-[150px] rounded-lg overflow-hidden flex items-center justify-center">
          <img src={frontendImg || ""} alt="" className=" h-full rounded-lg"/>
        </div>

        <div className="w-[100%] h-[200px] flex flex-col">
          <div className="flex items-center justify-start p-[10px] border-b-2 border-gray-400 cursor-pointer">
            <BsImage className="w-[25px] h-[20px] text-gray-500" onClick={()=>image.current.click()}/></div>

          <div className="flex items-center justify-end">
            <button className="w-[100px] h-[40px] rounded-full bg-amber-400 text-black font-semibold cursor-pointer mt-[20px]"
           disabled = {posting} onClick={handleUploadPost}> {posting? "Posting..." : "Post"}</button>
          </div>
        </div>


      </div>}

      {/* MIDDLE-SIDE DIV */}
      
      <div className="w-full lg:w-[50%] min-h-[200px] flex flex-col items-center justify-center gap-[20px]">
        <div className="w-full h-[100px] bg-white shadow-lg rounded-lg flex justify-center items-center p-[20px] gap-[20px]">
          <div className="w-[50px] h-[50px] overflow-hidden rounded-full flex items-center justify-centre cursor-pointer"> 
            <img src={ userData.profileImage || profile} alt="dp" className=" h-full cursor-pointer"/>
          </div>
          <button className="w-[80%] h-[80%] border-2 border-gray-500 rounded-[50px] flex items-center justify-start px-[20px] cursor-pointer"
          onClick={()=> setUploadPost(true)}> Create a post</button>
        </div>

        {/* Showing Post on Screen */}
        {postData.map((post, index) => (
          <Post 
            key={index} 
            id={post._id} 
            description={post.description} 
            author={post.author} 
            image={post.image} 
            like={post.like}
            comment={post.comment}
            createdAt={post.createdAt}
          />
        ))}

      </div>
      


      {/* RIGHT-SIDE DIV */}
      <div className="w-full lg:w-[25%] min-h-[200px] bg-[white] shadow-lg">

      </div>




    </div>
  )
}

export default home
