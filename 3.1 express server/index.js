import express from "express";
const app = express();


app.get("/contact",(req,res) =>{
  res.send("<h1> contact me </h1><p> 32165498726 </p>")
});

app.listen(3000,() => {
    console.log("server is on port 3000");
});