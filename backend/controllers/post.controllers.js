import uploadOnCloud from "../config/cloudinary.js";
import Post from "../models/post.models.js"

 export const createPost = async (req, res) =>{
    try {
        let {description} = req.body
        let newPost;
        if (req.file) {
            let image = await uploadOnCloud(req.file.path)
              newPost = await Post.create({
                author: req.userId,
                description,
                image
            })
        } else {
              newPost = await Post.create({
                author: req.userId,
                description
            })
        }
        return res.status(201).json(newPost)
    } catch (error) {
        return res.status(400).json(`create post error ${error}`)
    }
}

// Controller to show post on front screen
export const getPost = async (req, res) => {
    try {
        const post = await Post.find()
        .populate("author","firstName lastName profileImage headline")
        .sort({createdAt:-1})
        return res.status(200).json(post)
    } catch (error) {
        return res.status(500).json({message:"getPost error", error})
    }
}

// controller for likes
export const like = async (req, res) => {
    try {
        let postId = req.params.id;
        let userId =req.userId;
        let post = await Post.findById(postId)
        if (!post) {
            return res.status(400).json({message:"post not found!"})
        }
        
        if (post.like.includes(userId)) {
            post.like.filter((id) => id != userId)
        } else {
           post.like.push(userId) 
        }
        await post.save()
        return res.status(200).json(post)
    } catch (error) {
         return res.status(500).json({message:"like error", error})
    }
}


// controllers for comments

export const comment = async (req, res) => {
    try {
        let postId = req.params.id;
        let userId =req.userId;
        let {content} = req.body;
          
        
    } catch (error) {
        
    }
}