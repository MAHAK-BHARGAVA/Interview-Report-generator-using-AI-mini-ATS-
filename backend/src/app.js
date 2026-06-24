import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true })); // ← parses form data
app.use(cookieParser());
const allowedOrigins = [
  'http://localhost:5173',
  'https://skillscopeai.vercel.app'
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));
import authRouter from './routes/authroutes.js';
import interviewRouter from './routes/interviewroutes.js';

app.use('/api/auth', authRouter);
app.use('/api/interview', interviewRouter);
export default app; 