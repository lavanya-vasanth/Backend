const fs=require('fs')
const http=require("http");
//const { json } = require('stream/consumers');
//var server=http.createServer((req,res)=>{
  
fs.readFile('./sample.json','utf8',(err,data)=>{
    if(err){
        console.log("Cannot Open File");
        return
    }
    //console.log(JSON.parse(data));
//});
//});
//server.listen(3001, () => {
   // console.log("Server is running on http://localhost:3001");
//})
const jsonData = JSON.parse(data);
const filteredData = jsonData.filter((user) => user.amount > 1500);
fs.writeFile("./data.json",JSON.stringify(filteredData),(err) => {
    if(err) {
        console.log("Error writing file");
        return
    }
    })
});