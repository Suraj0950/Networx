import jwt from "jsonwebtoken";

// generate token 
const generateToken = (userId) => {
    try {
        let token = jwt.sign({userId}, process.env.JWT_SECRET_KEY, {expiresIn:"7d"})
        return token
    } catch (error) {
        console.log(error);  
    } 
}

export default generateToken