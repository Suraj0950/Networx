import generateToken from "../config/token.js";
import User from "../models/user.models.js";
import bcrypt from 'bcrypt'; 


//for user signup
export const signup = async(req, res) => {
    try {
        let { firstName, lastName, userName, email, password } = req.body;

        // find user by email
        let existEmail = await User.findOne({email})
        if (existEmail) {
            return res.status(400).json({ message : "User already existed"});
        };

        //find user by username
        let existUsername = await User.findOne({userName})
        if (existUsername) {
            return res.status(400).json({ message : "User already existed"});
        };

        //condition :- password must be < 8 characters  !
        if (password.length < 8){
            return res.status(400).json({ message : "Password must be atlest 8 characters long!"})
        };

        // hashing user password through bcrypt
        let hashPassword = await bcrypt.hash(password,10);

        // create user
        const user = await User.create({
            firstName : firstName, 
            lastName : lastName, 
            userName : userName, 
            email : email, 
            password : hashPassword,

        });

        // token controller
        let token = generateToken(user._id);
        // now passing this this token to the cookies
        res.cookie("token", token, {
            httpOnly : true,
            maxAge : 7*24*60*60*1000,
            sameSite : "strict",
            secure : process.env.NODE_ENVIRONMENT === "production"
        });
        return res.status(201).json(user);

    } catch (error) {
        console.log(error);
        return res.status(500).json({message : "signup error"})     
    }
};


// for user login 

export const login = async(req,res) => {
    try {
        let { email, password } = req.body;

        // find user by email 
        let existUser = await User.findOne({email})
        if (!existUser) {
            return res.status(400).json({ message : "User does not exists!"});
        };

        // campare user password through bcrypt
        const isPassMatch = await bcrypt.compare(password, existUser.password);
        if (!isPassMatch) {
            return res.status(400).json({message:"incorrect password!"})

        }
        // token generate hoga
        let token = generateToken(existUser._id);
        // now passing this this token to the cookies
        res.cookie("token", token, {
            httpOnly : true,
            maxAge : 7*24*60*60*1000,
            sameSite : "strict",
            secure : process.env.NODE_ENVIRONMENT === "production"
        });
        return res.status(200).json(existUser);
        
    } catch (error) {
        console.log(error);
        return res.status(500).json({message : "login error"})   
    }
};

// for user logout
export const logout = async(req, res) => {
    try {
        res.clearCookie("token")
        return res.status(200).json({message : "user logout successfully" })
    } catch (error) {
        console.log(error);
        return res.status(200).json({message : "user logout successfully"})
    }
};