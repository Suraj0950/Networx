import { useContext, useRef, useState } from "react";
import { RxCross2 } from "react-icons/rx";
import { userDataContext } from "../context/UserContext.jsx";
import profile from "../assets/profile.png";
import { FaPlus } from "react-icons/fa6";
import { IoCameraOutline } from "react-icons/io5";
import { authDataContext } from "../context/AuthContext.jsx";
import axios from "axios";

function EditProfile(e) {


  let {setEdit, userData, setUserData} = useContext(userDataContext)
  let {serverUrl} = useContext(authDataContext)
  let [firstName, setFirstName] = useState(userData.firstName || "")
  let [lastName, setLastName] = useState(userData.lastName || "")
  let [userName, setUserName] = useState(userData.userName || "")
  let [headline, setHeadline] = useState(userData.headline || "")
  let [location, setLocation] = useState(userData.location || "")
  let [gender, setGender] = useState(userData.gender || "")
  let [skills, setSkills] = useState(userData.skills || "")
  let [newSkills, setNewSkills] = useState("")

  let [education, setEducation] = useState(userData.education || [])
  let [newEducation, setNewEducation] = useState({
    college:"",
    degree:"",
    fieldOfStudy:""      
  })

  let [experience, setExperience] = useState(userData.experience || [])
  let [newExperience, setNewExperience] = useState({
    title:"",
    company:"",
    description:""      
  })
  // Hooks for profile Image
  let [frontendProfileImage, setFrontendProfileImage] = useState( userData.profileImage || profile)
  let [BackendProfileImage, setBackendProfileImage] = useState(null)
  // Hooks for Cover Image 
  let [frontendCoverImage, setFrontendCoverImage] = useState( userData.coverImage || null )
  let [BackendCoverImage, setBackendCoverImage] = useState(null)
  let [saving, setSaving] = useState(false)

  const profileImage = useRef()
  const coverImage = useRef()

  //Function for ADD Skills
  function addSkill(e) {
    e.preventDefault()
    if (newSkills && !skills.includes(newSkills)){
      setSkills([...skills, newSkills])
    }
   setNewSkills("")
  }

  //Function for remove skill
  function removeSkill(skill) {
    if(skills.includes(skill)){
    setSkills(skills.filter((s)=>s!= skill))
    }
  }

  //Function  for add education
  function addEducation(e) {
    e.preventDefault()
    if ( newEducation.college && newEducation.degree && newEducation.fieldOfStudy ){
      setEducation([...education, newEducation])
    }
   setNewEducation({
    college:(""),
    degree:(""),
    fieldOfStudy:("")
   })
  }

  //Function for remove education
  function removeEducation(edu) {
    if(education.includes(edu)){
    setEducation(education.filter((e)=>e!= edu))
    }
  }

  //Function  for add Experience
  function addExperience(e) {
    e.preventDefault()
    if ( newExperience.title && newExperience.company && newExperience.description ){
      setExperience([...experience, newExperience])
    }
   setNewExperience({
    title:(""),
    company:(""),
    description:("")
   })
  }

  //Function for remove Experience
  function removeExperience(exp) {
    if(experience.includes(exp)){
    setExperience(experience.filter((e)=>e!= exp))
    }
  }

  //Function to change profile image
  function handleProfileImage(e){
    let file = e.target.files[0]
    setBackendProfileImage(file)
    setFrontendProfileImage(URL.createObjectURL(file))
  }

  //Function to change cover image
  function handleCoverImage(e){
    let file = e.target.files[0]
    setBackendCoverImage(file)
    setFrontendCoverImage(URL.createObjectURL(file))
  }

  //Function for Save profile
  const handleSaveProfile = async () => {
    setSaving(true)
    try {
      let formdata = new FormData()
      formdata.append("firstName" , firstName)
      formdata.append("lastName"  , lastName)
      formdata.append("userName"  , userName)
      formdata.append("headline"  , headline)
      formdata.append("location"  , location)
      formdata.append("skills"    , JSON.stringify(skills))
      formdata.append("education" , JSON.stringify(education))
      formdata.append("experience", JSON.stringify(experience))

      if(BackendProfileImage){
        formdata.append("profileImage", BackendProfileImage)
      }
      if(BackendCoverImage){
        formdata.append("coverImage", BackendCoverImage)
      }

      let Response = await axios.put(serverUrl + "/api/user/updateprofile", formdata, { withCredentials:true})
      setUserData(Response.data)
      setSaving(false)
      setEdit(false)
    } catch (error) {
      console.log(error)
      setSaving(false)
    }
  }

  return (
    <div className='w-full h-[100vh] fixed top-0 z-[100] flex items-center justify-center'>

      <input type="file" accept="image/*" hidden ref={profileImage} onChange={handleProfileImage}/>
      <input type="file" accept="image/*" hidden ref={coverImage} onChange={handleCoverImage}/>


      <div className='w-full h-full bg-black opacity-[0.5] absolute top-0 left-0'></div>
      
      <div className='w-[90%] max-w-[500px] h-[600px] bg-[white] relative z-[200] rounded-lg shadow-lg p-[10px] overflow-auto'>

        <div className=" absolute top-[10px] right-[10px]"
          onClick = {() => setEdit(false)}><RxCross2  className=" text-red-600 font-bold w-[25px] h-[25px] cursor-pointer"/>
        </div>

        {/*THIS IS COVER IMAGE DIV */}
        <div className=" w=full h-[150px] bg-gray-500 rounded-lg mt-[30px] overflow-hidden cursor-pointer"
        onClick={()=> coverImage.current.click()}>
          <img src={frontendCoverImage} alt="" />
          <IoCameraOutline className="h-[22px] w-[27px] text-gray-800 absolute top-[50px] right-[20px]"/>
        </div>

        {/*THIS IS PROFILE DIV */}
        <div  className=" cursor-pointer w-[60px] h-[60px] rounded-full overflow-hidden absolute top-[150px] ml-[20px]"
        onClick={()=> profileImage.current.click()}>
          <img src={frontendProfileImage} alt="dp" />
        </div>
        <div className=" text-[15px] bg-[#388aed] rounded-full text-[white] absolute top-[190px] left-[75px] flex justify-center items-center cursor-pointer"><FaPlus/></div>

        <div className=" w-full flex flex-col items-center justify-center gap-[20px] mt-[50px]">
          <input type="text" placeholder="firstname" className="w-full h-[50px] outline-none
           border-gray-600 px-[10px] py-[5px] text-[18px] border-2 rounded-lg" value={firstName} onChange={(e)=> setFirstName(e.target.value)}/>
          <input type="text" placeholder="lastname"  className="w-full h-[50px] outline-none
           border-gray-600 px-[10px] py-[5px] text-[18px] border-2 rounded-lg" value={lastName} onChange={(e)=> setLastName(e.target.value)}/>
          <input type="text" placeholder="username"  className="w-full h-[50px] outline-none
           border-gray-600 px-[10px] py-[5px] text-[18px] border-2 rounded-lg" value={userName} onChange={(e)=> setUserName(e.target.value)}/>
          <input type="text" placeholder="headline"  className="w-full h-[50px] outline-none
           border-gray-600 px-[10px] py-[5px] text-[18px] border-2 rounded-lg" value={headline} onChange={(e)=> setHeadline(e.target.value)}/>
          <input type="text" placeholder="location"  className="w-full h-[50px] outline-none
           border-gray-600 px-[10px] py-[5px] text-[18px] border-2 rounded-lg" value={location} onChange={(e)=> setLocation(e.target.value)}/>
          <input type="text" placeholder="gender (male/female/others)" className="w-full h-[50px] outline-none
           border-gray-600 px-[10px] py-[5px] text-[18px] border-2 rounded-lg" value={gender} onChange={(e)=> setGender(e.target.value)}/>

          <div className="w-full p-[10px] border-2 border-gray-600 flex flex-col gap-[10px] rounded-lg ">
              <h1 className=" text-[19px] font-semibold "> Skills</h1>
            {skills && <div className="flex flex-col gap-[10px]">
              {skills.map((skill, index) => (
                <div key={index} className="w-full h-[30px] p-[10px] flex items-center justify-between border-[1px]
                border-gray-400 bg-gray-200 rounded" ><span>{skill}</span>
                <RxCross2 className=" text-red-600 font-bold w-[20px] h-[20px] cursor-pointer" 
                onClick={() => removeSkill(skill)}></RxCross2></div>
              ))}
            </div>}

            <div className="flex flex-col gap-[1px] items-start">
              <input type="text" placeholder="add new skill" value={newSkills} onChange={(e)=> setNewSkills(e.target.value)}
              className="w-full h-[40px] outline-none border-gray-400 px-[10px] py-[5px] text-[16px] border-2 rounded-lg"></input>
              <button className=" w-full h-[40px] mt-[20px] border-2 rounded-full border-[#2ea2e6] text-[#2ea2e6] cursor-pointer flex items-center justify-center gap-[10px]" onClick={addSkill}>Add</button>
            </div>

          </div>
            
            <div className="w-full p-[10px] border-2 border-gray-600 flex flex-col gap-[10px] rounded-lg ">
              <h1 className=" text-[19px] font-semibold "> Education </h1>
             {education && <div className="flex flex-col gap-[10px]">
              {education.map((edu, index) => (
                <div key={index} 
                className="w-full p-[10px] relative border-[1px]border-gray-400 bg-gray-200 rounded " ><div>
                  <div> College : {edu.college}</div>
                  <div> Degree : {edu.degree}</div>
                  <div> FieldOfStudy : {edu.fieldOfStudy}</div>
                </div>
                <RxCross2 className=" absolute top-[8px] right-[8px] text-red-600 font-bold w-[20px] h-[20px] cursor-pointer" 
                onClick={ () => removeEducation(edu) }/></div>
              ))}
            </div>}

            <div className="flex flex-col gap-[10px] items-start">
              <input type="text" placeholder="College" value={newEducation.college} 
              onChange={(e) => setNewEducation({...newEducation, college : e.target.value})}
              className="w-full h-[40px] outline-none border-gray-400 px-[10px] py-[5px] text-[16px] border-2 rounded-lg"></input>

              <input type="text" placeholder="Degree" value={newEducation.degree} 
              onChange={(e) => setNewEducation({...newEducation, degree : e.target.value})}
              className="w-full h-[40px] outline-none border-gray-400 px-[10px] py-[5px] text-[16px] border-2 rounded-lg"></input>

              <input type="text" placeholder="Field of study" value={newEducation.fieldOfStudy} 
              onChange={(e) => setNewEducation({...newEducation, fieldOfStudy : e.target.value})}
              className="w-full h-[40px] outline-none border-gray-400 px-[10px] py-[5px] text-[16px] border-2 rounded-lg"></input>

              <button className=" w-full h-[40px] mt-[20px] border-2 rounded-full border-[#2ea2e6] 
              text-[#2ea2e6] cursor-pointer flex items-center justify-center gap-[10px]" 
              onClick={addEducation}>Add</button>
            </div>

          </div>

          <div className="w-full p-[10px] border-2 border-gray-600 flex flex-col gap-[10px] rounded-lg ">
              <h1 className=" text-[19px] font-semibold "> Experience </h1>
             {experience && <div className="flex flex-col gap-[10px]">
              {experience.map((exp, index) => (
                <div key={index}
                className="w-full p-[10px] relative border-[1px]border-gray-400 bg-gray-200 rounded " ><div>
                  <div> Title : {exp.title}</div>
                  <div> Company : {exp.company}</div>
                  <div> Description : {exp.description}</div>
                </div>
                <RxCross2 className=" absolute top-[8px] right-[8px] text-red-600 font-bold w-[20px] h-[20px] cursor-pointer " 
                onClick={ () => removeExperience(exp) }/></div>
              ))}
            </div>}

            <div className="flex flex-col gap-[10px] items-start">
              <input type="text" placeholder="Title" value={newExperience.title} 
              onChange={(e) => setNewExperience({...newExperience, title : e.target.value})}
              className="w-full h-[40px] outline-none border-gray-400 px-[10px] py-[5px] text-[16px] border-2 rounded-lg"></input>

              <input type="text" placeholder="Company" value={newExperience.company} 
              onChange={(e) => setNewExperience({...newExperience, company : e.target.value})}
              className="w-full h-[40px] outline-none border-gray-400 px-[10px] py-[5px] text-[16px] border-2 rounded-lg"></input>

              <input type="text" placeholder="Description" value={newExperience.description} 
              onChange={(e) => setNewExperience({...newExperience, description : e.target.value})}
              className="w-full h-[40px] outline-none border-gray-400 px-[10px] py-[5px] text-[16px] border-2 rounded-lg"></input>

              <button className=" w-full h-[40px] mt-[20px] border-2 rounded-full border-[#2ea2e6] 
              text-[#2ea2e6] cursor-pointer flex items-center justify-center gap-[10px]" 
              onClick={addExperience}>Add</button>
            </div>

          </div>

          <button className="w-[100%] h-[40px] rounded-full bg-amber-400 text-black font-semibold cursor-pointer"
          disabled = {saving} onClick={() => handleSaveProfile()}>{ saving?'saving...': 'Save Profile'}</button>

        </div> 
      </div>  
    </div>
  )
}

export default EditProfile
