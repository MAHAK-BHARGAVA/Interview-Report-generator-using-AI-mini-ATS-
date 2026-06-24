import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true })); // ← parses form data
app.use(cookieParser());
app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
}));
import authRouter from './routes/authroutes.js';
import interviewRouter from './routes/interviewroutes.js';

app.use('/api/auth', authRouter);
app.use('/api/interview', interviewRouter);
export default app; 