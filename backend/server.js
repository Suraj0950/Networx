import express from 'express';
import dotenv from 'dotenv';
import connectDb from './config/db.js';
import authRouter from './routes/auth.routes.js';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import userRouter from './routes/user.routes.js';
import postRouter from './routes/post.routes.js';

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

// ✔️ CORS should be registered first — BEFORE routes
app.use(cors({
  origin: "http://localhost:5173",
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  credentials: true,
}));

// Middlewares
app.use(express.json());
app.use(express.urlencoded({extended:false}))
app.use(express.static("public"))
app.use(cookieParser());



// Routes
app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);
app.use("/api/post", postRouter);
 

app.get("/", (req, res) => {
  res.send("Hello suryaveer");
});

app.listen(port, () => {
  connectDb();
  console.log(`server is listening on port ${port} ✔️`);
});
