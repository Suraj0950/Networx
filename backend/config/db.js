import mongoose from "mongoose";

const connectDb=async ()=>{
    try { 
      await mongoose.connect(process.env.MONGO_URL)
        console.log("mongoDB database connected ✔️")
    } catch (error) {
        console.log("database connection error ❌");
    }
}
export default connectDb