import expenseModel from "../models/expenseModel.js";
import getDateRange from "../utils/dateFilter.js";
import XLSX from "xlsx";

// ADD EXPENSE
export async function addExpense(req, res) {
    const userId = req.user.id;
    const { description, amount, category, date } = req.body;
    
    try{
        if(!description || !amount || !category || !date){
            return res.status(400).json({
                message : "Please fill all the fields",
                success : false
            });
        }
        const newExpense = new expenseModel({
                    userId,
                    description,
                    amount,
                    category,
                    date : new Date(date)
                });
                await newExpense.save();
                return res.json({
                    message : "Expense added successfully",
                    success : true,
                });
    }
    catch(error){
        console.log(error);
        return res.status(500).json({
            message : "Server error",
            success : false
        });
    }
}

// TO GET ALL EXPENSE
export async function getAllExpense(req, res) {
    const userId = req.user.id;
        try{
            const expense = await expenseModel.find({ userId }).sort({ date : -1 });
            return res.json({
                message : "Expenses fetched successfully",
                expense
                
            });
        }
        catch(error){
            console.log(error);
            return res.status(500).json({
                message : "Server error",
                success : false
            });
        }
}

// Update Expense

export async function updateExpense(req, res) {
     const { id } = req.params;
        const userId = req.user.id;
        const { description, amount} = req.body;
    
        try{
            const updatedExpense = await expenseModel.findOneAndUpdate(
                { _id : id, userId },
                { description, amount },
                { new : true }
            );
    
            if(!updatedExpense){
                return res.status(404).json({
                    message : "Expense not found",
                    success : false
                });
            }
            return res.json({
                message : "Expense updated successfully",
                success : true,
                data : updatedExpense
            });
        }
        catch(error){
            console.log(error);
            return res.status(500).json({
                message : "Server error",
                success : false
            });
        }
}
// Delete Expense
export async function deleteExpense(req, res) {
    try{
            const deletedExpense = await expenseModel.findOneAndDelete({ _id : req.params.id });
            if(!deletedExpense){
                return res.status(404).json({
                    message : "Expense not found",
                    success : false
                });
            }
            return res.json({
                message : "Expense deleted successfully",
                success : true,
            });
        }   
        catch(error){
            console.log(error);
            return res.status(500).json({
                message : "Server error",
                success : false
            });
        }
}

// Download Expense Report
export async function downloadExpenseReport(req, res) {
    const userId = req.userId;
    try{
        const expenses = await expenseModel.find({ userId }).sort({ date : -1 });

        const plainData = expenses.map((expense)=>({
            description : expense.description,
            amount : expense.amount,
            category : expense.category,
            date : new Date(expense.date).toLocaleDateString(),
        }))

        const worksheet = XLSX.utils.json_to_sheet(plainData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Expenses");
        XLSX.writeFile(workbook, "Expense_Details.xlsx");
        res.download("Expense_Details.xlsx");
    }
    catch(error){
        console.log(error);
        return res.status(500).json({
            message : "Server error",
            success : false
        });
    }
}
// Get Expense Overview

export async function getExpenseOverview(req, res) {
    try{
            const userId = req.user._id;
            const { range } = req.query;
            const { start, end } = getDateRange(range);
    
            const expenses = await expenseModel.find({
                userId,
                date : {
                    $gte : start,
                    $lte : end
                }
            }).sort({ date : -1 });
    
            
    
        const totalExpense = expenses.reduce((acc, cur) => acc + cur.amount, 0);
        const averageExpense = expenses.length > 0 ? totalExpense / expenses.length : 0;
        const numberOfTransactions = expenses.length;
        const recentTransactions = expenses.slice(0, 5);
    
            return res.json({
                message : "Expense overview fetched successfully",
                success : true,
                data : {
                    totalExpense,
                    averageExpense,
                    numberOfTransactions,
                    recentTransactions,
                    range
                }
            })
    
        }
        catch(error){
            console.log(error);
            return res.status(500).json({
                message : "Server error",
                success : false
            });
        }
}