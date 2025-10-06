import { useState, useEffect, useContext } from 'react'
import profile from '../assets/profile.png'
import moment from 'moment'
import { BiLike, BiSolidLike } from "react-icons/bi"
import { FaRegCommentDots } from "react-icons/fa6"
import { TbSend2 } from "react-icons/tb"
import { authDataContext } from '../context/AuthContext'
import { userDataContext } from '../context/UserContext'
import axios from "axios"

function Post({
  id,
  author = {},
  comment = [],
  description = "",
  image = "",
  createdAt = new Date(),
  like = []
}) {

  const [more, setMore] = useState(false)
  const { serverUrl } = useContext(authDataContext)
  const { userData, getPost } = useContext(userDataContext)

  const [likes, setLikes] = useState(like || [])
  const [commentContent, setCommentContent] = useState("")
  const [comments, setComments] = useState(comment || [])

  // ✅ FIXED: handleLike logic simplified and made safe with optional chaining
  const handleLike = async (e) => {
    e.preventDefault()
    try {
      if (likes.includes(userData?._id)) {
        setLikes(prev => prev.filter(id => id !== userData._id))
      } else {
        setLikes(prev => [...prev, userData._id])
      }

      await axios.get(`${serverUrl}/api/post/like/${id}`, { withCredentials: true })
    } catch (error) {
      console.log(error)
    }
  }

  // ✅ FIXED: used commentContent 
  const handleComment = async (e) => {
    e.preventDefault()
    if (!commentContent.trim()) return; // 🔒 prevent blank comment

    try {
      let result = await axios.post(
        `${serverUrl}/api/post/comment/${id}`,
        {content: commentContent},
        { withCredentials: true })
      setComments(result.data?.comment || [])
      console.log(result.data)
      setCommentContent("")          
    } catch (error) {
      console.log("Comment error", error)
    }
  }

  useEffect(() => {
    getPost()
  }, [])

  return (
    <div className='w-full min-h-[200px] bg-white rounded-lg p-5 gap-5 flex flex-col'>
      
      <div className='flex justify-between items-center'>
        <div className='flex items-center gap-3'>
          <div className="w-[52px] h-[52px] overflow-hidden rounded-full flex items-center justify-center"> 
            <img src={author?.profileImage || profile} alt="dp" className="h-full cursor-pointer" />
          </div>

          <div className='flex flex-col'>
            <div className="text-[18px] font-semibold mb-[-4px]">
              {`${author?.firstName || ""} ${author?.lastName || ""}`}
            </div>
            <div className="text-[14px]">{author?.headline}</div>
            <div className="text-[10px]">{moment(createdAt).fromNow()}</div>
          </div>
        </div>
      </div>

      
      <div className={`w-full pl-[5px] ${!more ? "max-h-[100px] overflow-hidden" : ""}`}>
        {description}
      </div>
      <div
        className='pl-[5px] text-[14px] text-gray-500 cursor-pointer'
        onClick={() => setMore(prev => !prev)}>
        {more ? "read less..." : "read more..."}
      </div>

      {/* ✅ image rendering check */}
      {image && (
        <div className='w-full h-[300px] overflow-hidden flex justify-center'>
          <img src={image} alt='' className='h-full rounded-lg' />
        </div>
      )}

      
      <div className='w-full flex justify-between items-center p-4 border-b'>
        <div className='flex items-center gap-2 text-[18px]'>
          <BiLike className='text-[#3bccf9] w-[22px] h-[22px] cursor-pointer' />
          <span>{likes.length}</span>
        </div>
        <div className='flex items-center gap-2 text-[18px]'>
          <FaRegCommentDots className='w-[20px] h-[20px] cursor-pointer' />
          <span>{comments.length}</span>
        </div>
      </div>

      
      <div className='w-full flex items-center p-4 gap-6'>
        <div onClick={handleLike} className='cursor-pointer flex items-center gap-1'>
          {likes.includes(userData?._id)
            ? (<><BiSolidLike className='text-[#0077ff] w-[22px] h-[22px]' /><span>Liked</span></>)
            : (<><BiLike className='text-[#0077ff] w-[22px] h-[22px]' /><span>Like</span></>)
          }
        </div>

        <div className='cursor-pointer flex items-center gap-1'>
          <FaRegCommentDots className='w-[22px] h-[22px]' />
          <span>Comment</span>
        </div>
      </div>

      {/* ✅ Input binding */}
      <form
        onSubmit={handleComment}
        className='w-full flex justify-between items-center border-b-2 border-gray-200 p-2'>
        <input
          type='text'
          placeholder='leave a comment'
          className='w-full outline-none border-none'
          value={commentContent}                        
          onChange={(e) => setCommentContent(e.target.value)}  
        />
        <button type="submit">
          <TbSend2 className='w-[25px] h-[25px] text-[rgb(0,191,255)] cursor-pointer' />
        </button>
      </form>

      {/* ✅ Added Comment mapping */}
      <div className='flex flex-col gap-3'>
        {comments.map((com, idx) => (
          <div key={idx} className='flex items-start gap-3'>
            <div className="w-[35px] h-[35px] overflow-hidden rounded-full flex items-center justify-center">
              <img src={com?.user?.profileImage || profile} alt="dp" className="h-full cursor-pointer" />
            </div>
            <div>
              <div className="text-[15px] font-semibold">
                {`${com?.user?.firstName || ""} ${com?.user?.lastName || ""}`}
              </div>
              <div className="text-[14px] text-gray-700">{com?.content}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Post
