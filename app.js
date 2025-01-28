const express = require("express");
const app = express();
const mongoose = require("mongoose");
const cors = require("cors");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const authMiddleware = require("./middlewares/auth");

app.use(express.json()); //Middleware to parse JSON data
app.use(cors()); //Middleware to enable CORS
//To avoid cross origin resource sharing error which means the frontend and backend should be in the same domain
const { v4: uuidv4 } = require("uuid"); //to generate id automatically in the backend

//Connecting mongodb database
mongoose.connect("mongodb://localhost:27017/expenses").then(() => {
  console.log("Connected to database");
});

const userSchema = new mongoose.Schema({
  id: String,
  name: String,
  email: String,
  password: String,
});
const User = mongoose.model("User", userSchema);

app.post("/signup", async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: "Email already  exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10); //this method compute hash and return the password

    const newUser = new User({
      id: uuidv4(),
      name,
      email,
      password: hashedPassword,
    });
    await newUser.save();
    res.json({ message: "User created successfully" });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
});

app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid email" });
    }
    const isValidPassword = await bcrypt.compare(password, user.password); //decrypts and compares and returns a boolean value
    if (!isValidPassword) {
      return res.status(400).json({ message: "Invalid password" });
    }
    const token = jwt.sign({ id: user.id }, "secret_key", { expiresIn: "1h" });
    res.status(200).json(token);
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
});

//creation of schema design
const expenseSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  title: { type: String, required: true }, //required true means this field is must
  amount: { type: Number, required: true }, //title and amount is must needed fields
});

const Expenses = mongoose.model("Expenses", expenseSchema);

app.get("/api/expenses", authMiddleware, async (req, res) => {
  try {
    const expenses = await Expenses.find();
    res.status(200).json(expenses);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch expenses" });
  }
});

app.get("/api/expenses/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const expense = await Expenses.findOne({ id });
    if (!expense) {
      return res.status(404).json({ message: "Expense not found" });
    }
    res.status(200).json(expense);
  } catch (error) {
    res.status(500).json({ message: "Error in fetching expenses" });
  }
});

app.post("/api/expenses", async (req, res) => {
  //console.log(req.body)
  const { title, amount } = req.body; //can be destructured like this
  //console.log(title)//can be destructured and displayed separately
  try {
    const newExpense = new Expenses({
      id: uuidv4(),
      //uuidv4 will be unique and no duplicate id will be generated
      title: title, //title alone can be provided if the key and value are same in the object by means name and case then the key alone can be given
      amount: amount, //amount alone can be provided if the key and value are same in the object
    });
    //console.log(newExpense)//to check the uuid generated
    const savedExpense = await newExpense.save();
    res.status(200).json(savedExpense);
  } catch (err) {
    res.status(500).json({ message: "Error in creating expense" });
  }
});

app.put("/api/expenses/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { title, amount } = req.body;
    const updatedExpense = await Expenses.findOneAndUpdate(
      { id },
      { title: title, amount: amount }
    );
    if (!updatedExpense) {
      return res.status(404).json({ message: "Expense not found" });
    }
    res.status(200).json({ title, amount });
  } catch (error) {
    res.status(500).json({ message: "Error in updating expense" });
  }
});

app.delete("/api/expenses/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const deletedExpense = await Expenses.findOneAndDelete({ id });
    if (!deletedExpense) {
      return res.status(404).json({ message: "Expense not found" });
    }
    res.status(200).json(deletedExpense);
  } catch (error) {
    res.status(500).json({ message: "Error in deleting expense" });
  }
});

app.listen(3002, () => {
  console.log("Server is running on port 3002");
});
/*
const students =[
    {
        name:"Suriya",
        age:20,
        roll:1,
    },
    {
        name:"Vijay",
        age:21,
        roll:2
    }
]
*/
/*
app.get("/api/sayHello",(req,res)=>{
    res.send("Hello!!")
    res.end()
})

app.get("/api/students",(req,res)=>{
    res.status(200).json(students)
    res.end()
})

//by get only small amount of data can be passed
app.get("/api/students/:rollno",(req,res)=>{
    const {rollno} = req.params
    const student = students.find((student)=> student.roll == rollno)
    if(!student){
        res.status(404).json({message:"Student not found"})
    }
    else{
        res.status(200).json(student)
    }
})
*/