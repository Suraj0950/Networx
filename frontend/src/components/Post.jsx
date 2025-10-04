import { useState, useEffect, useContext } from 'react'
import profile from '../assets/profile.png'
import moment from 'moment'
import { BiLike } from "react-icons/bi";
import { BiSolidLike } from "react-icons/bi";
import { FaRegCommentDots } from "react-icons/fa6";
import { authDataContext } from '../context/AuthContext';
import axios from "axios";
import { userDataContext } from '../context/UserContext';
import { TbSend2 } from "react-icons/tb";

function Post({id, author = {},comment = [],description = "",image = "",createdAt = new Date(),like = [] }) {

  let [more, setMore] = useState(false)
  
  let {serverUrl} = useContext(authDataContext)
  let {userData, setUserData, getPost} = useContext(userDataContext)
  let [likes,setLikes] = useState(like || [])

  const handleLike = async () => {
  try {
    // Optimistic UI update first
    if (likes.includes(userData._id)) {
      // user already liked → remove like locally
      setLikes(prev => prev.filter(id => id !== userData._id));
    } else {
      // user not liked → add like locally
      setLikes(prev => [...prev, userData._id]);
    }

    // then update backend
    await axios.get(`${serverUrl}/api/post/like/${id}`, { withCredentials: true });
  } catch (error) {
    console.log(error);
  }
};


  useEffect(()=>{
    getPost()
  },[])

  return (
    // MAIN DIV OF POST
    <div className='w-full min-h-[200px] bg-white rounded-lg p-[20px] gap-[20px] flex flex-col'>
      {/* Name and profile div */}
      <div className='flex justify-between items-center'>
        <div className='flex justify-centre items-center gap-[10px]'>
          <div className="w-[52px] h-[52px] overflow-hidden rounded-full flex items-center justify-centre"> 
            <img src={ author.profileImage || profile} alt="dp" className=" h-full cursor-pointer"/>
          </div>
          <div className='flex flex-col ]'>
            <div className="text-[18px] font-semibold mb-[-7px]">{`${author.firstName} ${author.lastName}`}</div>
            <div className="text-[14px]">{`${author.headline}`}</div>
            <div className="text-[10px]">{moment(createdAt).fromNow()}</div>
          </div>
        </div>
 
        <div>
          {/* button */}
        </div>
      </div>

      {/* Post Description */}
      <div className={`w-full pl-[5px] ${!more? "max-h-[100px] overflow-hidden" : ""}`}>
      {description}</div>
      <div className='pl-[5px] text-[14px] text-gray-500 cursor-pointer'
      onClick={()=>setMore(prev=>!prev)}>{more?"read less...":"read more..."}</div>

      {image && <div className='w-full h-[300px] overflow-hidden flex justify-center'>
        <img src={image} alt='' className='h-full rounded-lg'/>
      </div>}

      {/* LIKE & COMMENT DIV */}
      <div>
        
        {/* SHowing result for like and comment div */}

        <div className='w-full flex justify-between items-center p-[20px] border-b-1 border-gray-500'>
          <div className='flex items-center justify-center gap-[5px] text-[18px]'>
            <BiLike className='text-[#3bccf9] w-[22px] h-[22px] cursor-pointer'/><span>{likes.length}</span>
          </div>

          <div className='flex items-center justify-center gap-[5px] text-[18px]'>
            <FaRegCommentDots className=' w-[20px] h-[20px] cursor-pointer'/><span>{comment.length}</span>
          </div>
        </div>

        {/* Author doing like and comment div */}
        <div className='w-full flex items-center p-[20px] gap-[20px] '>

          {!likes.includes(userData._id) &&  <div  onClick={handleLike}>
            <BiLike className=' w-[22px] h-[22px] cursor-pointer text-[#0077ff]'/>
            <span>Like</span>
          </div>}

          {likes.includes(userData._id) &&  <div  onClick={handleLike}>
            <BiSolidLike className=' w-[22px] h-[22px] cursor-pointer text-[#0077ff]'/>
            <span>Liked</span>
          </div>}
          
          
          <div>
            <FaRegCommentDots className=' w-[22px] h-[22px] cursor-pointer'/>
            <span>comment</span>
          </div>  
        </div>

        {/* leave a comment wala div */}
        <div>
          <form className='w-full flex justify-between items-center border-b-2 border-b-gray-200 p-[10px]'>
            <input type='text' placeholder={"leave a comment "} className='outline-none border-none'/>
            <button><TbSend2 className='w-[22px] h-[22px] text-[rgb(0,238,255)]'/></button>
          </form>

          {/* div for comment map */}
          <div>
            
          </div>


        </div>

      </div>

    </div>
  )
}

export default Post

