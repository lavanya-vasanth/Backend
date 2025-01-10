var express = require("express");
const mongoose = require('mongoose');
const{v4:uuidv4} = require("uuid");
const app = express();
//Middleware
app.use(express.json())

//Set up default mongoose connection->mongoose.connect
mongoose.connect("mongodb+srv://lavanyav2023cce:lavi1515@cluster0.lfyvjqo.mongodb.net/expenses").then(()=>{
    console.log("Connected to database");
});

//schema->new mongoose.schema
const expenseSchema = new mongoose.Schema({
    id: { type: String, requied: true, unique: true },
    title: { type: String, required: true },
    amount: { type: Number, required: true }

})

const Expenses = mongoose.model("Expenses", expenseSchema);
//GET FUNCTION
app.get("/api/expenses",async(req,res)=> {
    try {
    const expenses =await Expenses.find();
    res.status(200).json(expenses)
    } catch(err) {
        res.status(500).json({ message:"Failed to fetch the Expenses"});
    }

});

app.get("/api/expenses/:id", async(req,res)=>{
    try{
        const{id} = req.params
        const expense = await Expenses.findOne({id})
        if(!expense){
            return res.status(404).json({message:"Expense not found"});
        }
        res.status(200).json(expense);
    } catch(error) {
         res.status(404).json({message:"Error in fetching expense"});

    }
});


//POST FUNCTION
app.post("/api/expenses", async(req,res)=>{
    console.log(req.body)
    const {title,amount}=req.body;
    try{
    const newExpenses=new Expenses({
        id:uuidv4(),
        title:title,
        amount:amount
    });
    const savedExpense=await newExpenses.save()
    res.status(200).json(savedExpense)
}catch(err){
    res.status(500).json({message:"Error in creating expensens"});
}
})
// PUT FUNCTION 
app.put("/api/expenses/:id",async(req,res)=>{
    const {id}=req.params;
    const{title,amount}=req.body;
    try{
        const updateExpenses=await Expenses.findOneAndUpdate(
        {id},
        {title,amount},
)
if(!updateExpenses){
    return res.status(404).json({message:"Expense not found"})
}
res.status(200).json(updateExpenses);
    }
    catch(error)
    {
   res.status(500).json({ message: "Error in updating data"});
    }
});
  
//DELETE FUNCTION
app.delete("/api/expenses/:id", async (req, res) => {
    const { id } = req.params;

    try {
        const deletedExpense = await Expenses.findOneAndDelete(id);

        if (!deletedExpense) {
            return res.status(404).json({ message: "Expense not found" });
        }

        res.status(200).json({ message: "Expense deleted successfully", deletedExpense });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Error in deleting expense" });
    }
});
/**const students=[
    {
        name:"suriya",
        age:20,
        roll:1,
    },
    {
        name:"vijay",
        age:21,
        roll:2
    },
];
app.get("/api/sayhello",(req,res)=>{
    res.send("Hello CCE");
    res.end();
});
app.get("/api/students",(req,res)=>{
    const {rollno}={req,res}
    res.status(200).json({name:"Avinash",age:25});
});*/
app.listen(3002, () => {
    console.log("Server is running on port 3002");
});