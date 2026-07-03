import incomeModel from "../models/incomeModel.js";
import XLSX from "xlsx";
import getDateRange from "../utils/dateFilter.js";

// ADD INCOME
export async function addIncome(req, res) {
    const userId = req.user.id;
    const { description, amount, category, date } = req.body;
    
    try{
        if(!description || !amount || !category || !date){
            return res.status(400).json({
                message : "Please fill all the fields",
                success : false
            });
        }
        const newIncome = new incomeModel({
            userId,
            description,
            amount,
            category,
            date : new Date(date)
        });
        await newIncome.save();
        return res.json({
            message : "Income added successfully",
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


 // TO GET ALL INCOME
export async function getAllIncome(req, res) {
    const userId = req.user.id;
    try{
        const incomes = await incomeModel.find({ userId }).sort({ date : -1 });
        return res.json({
            message : "Incomes fetched successfully",
            incomes
            
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

// Update income

export async function updateIncome(req, res) {
    const { id } = req.params;
    const userId = req.user.id;
    const { description, amount} = req.body;

    try{
        const updatedIncome = await incomeModel.findOneAndUpdate(
            { _id : id, userId },
            { description, amount },
            { new : true }
        );

        if(!updatedIncome){
            return res.status(404).json({
                message : "Income not found",
                success : false
            });
        }
        return res.json({
            message : "Income updated successfully",
            success : true,
            data : updatedIncome
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

 // Delete income
export async function deleteIncome(req, res) {
   
    try{
        const deletedIncome = await incomeModel.findOneAndDelete({ _id : req.params.id });
        if(!deletedIncome){
            return res.status(404).json({
                message : "Income not found",
                success : false
            });
        }
        return res.json({
            message : "Income deleted successfully",
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

// To Download Data In Excel Sheet 
 
export async function downloadIncomeExcel(req, res){
    const userId = req.userId;
    try{
        const incomes = await incomeModel.find({ userId }).sort({ date : -1 });

        const plainData = incomes.map((income)=>({
            description : income.description,
            amount : income.amount,
            category : income.category,
            date : new Date(income.date).toLocaleDateString(),
        }))

        const worksheet = XLSX.utils.json_to_sheet(plainData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Incomes");
        XLSX.writeFile(workbook, "Income_Details.xlsx");
        res.download("Income_Details.xlsx");
    }
    catch(error){
        console.log(error);
        return res.status(500).json({
            message : "Server error",
            success : false
        });
    }
}


 // get income Overview
  
 export async function getIncomeOverview(req, res){
    try{
        const userId = req.user._id;
        const { range } = req.query;
        const { start, end } = getDateRange(range);

        const incomes = await incomeModel.find({
            userId,
            date : {
                $gte : start,
                $lte : end
            }
        }).sort({ date : -1 });

        
        const totalIncome = incomes.reduce((acc, cur) => acc + cur.amount, 0);
        const averageIncome = incomes.length > 0 ? totalIncome / incomes.length : 0;
        const numberOfTransactions = incomes.length;
        const recentTransactions = incomes.slice(0, 9);

        return res.json({
            message : "Income overview fetched successfully",
            success : true,
            data : {
                totalIncome,
                averageIncome,
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