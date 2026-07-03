import express from "express";
import authMiddleware from "../middleware/auth.js";
import { addExpense, getAllExpense , updateExpense , deleteExpense, downloadExpenseReport,getExpenseOverview } from "../controllers/expenseController.js";

const expenseRouter = express.Router();

expenseRouter.post("/add", authMiddleware, addExpense);
expenseRouter.get("/get", authMiddleware, getAllExpense);
expenseRouter.put("/update/:id", authMiddleware, updateExpense);
expenseRouter.delete("/delete/:id", authMiddleware, deleteExpense);
expenseRouter.get("/downloadReport" , authMiddleware, downloadExpenseReport);
expenseRouter.get("/overview" , authMiddleware, getExpenseOverview);

export default expenseRouter;