import mongoose from "mongoose";

export const connectDB = async () => {
    await mongoose.connect("mongodb+srv://Expense-Tracker:iUdMwsxrl7tVmNu7@cluster0.n98az.mongodb.net/Expense")
        .then(() => console.log("MongoDB connected"))
        .catch((err) => console.log(err));
}
    