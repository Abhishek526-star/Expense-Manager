import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import { connectDB } from './config/db.js';
import userRouter from './routes/userRoute.js';
import incomeRouter from './routes/incomeRoute.js';
import expenseRouter from './routes/expenseRoute.js';
import dashboardRouter from './routes/dashboardRoute.js';
import contactRoutes from "./routes/contactRoutes.js";
import dotenv from "dotenv";
import net from "net";



dotenv.config();
const app = express();
const port = process.env.PORT || 4000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// DB 
connectDB();

// Routes 
app.use("/api/user", userRouter);
app.use("/api/income", incomeRouter);
app.use("/api/expense", expenseRouter);
app.use("/api/dashboard" , dashboardRouter);
app.use("/api", contactRoutes);

app.get("/smtp-test", (req, res) => {
  const socket = net.connect(587, "smtp-relay.brevo.com");

  socket.setTimeout(10000);

  socket.on("connect", () => {
    socket.destroy();
    res.json({
      success: true,
      message: "✅ Connected to Brevo SMTP",
    });
  });

  socket.on("timeout", () => {
    socket.destroy();
    res.status(500).json({
      success: false,
      message: "❌ SMTP connection timed out",
    });
  });

  socket.on("error", (err) => {
    res.status(500).json({
      success: false,
      error: err.message,
      code: err.code,
    });
  });
});



app.get('/', (req, res) => {
    res.send('API is running');
});

app.listen(port, () => {
    console.log(`🚀 Server is running on port ${port}`);
});

