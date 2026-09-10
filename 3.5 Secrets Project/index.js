//To see how the final website should work, run "node solution.js".
//Make sure you have installed all the dependencies with "npm i".
//The password is ILoveProgramming
import express from "express";
import bodyParser from "body-parser";
import { dirname } from "path";
import { fileURLToPath } from "url";

const __dirname =dirname(fileURLToPath(import.meta.url));

const port =3000;
const app = express();
function password(req, res,next){
    if (req.body["password"]==="ILoveProgramming"){
        res.sendfile(__dirname + "/public/secret.html");
    } else {
        res.sendfile(__dirname + "/public/index.html");
    }
    next();
};
app.use(bodyParser.urlencoded({extended:true}));
app.use(password);
app.get("/",(req,res)=>{
    res.sendfile(__dirname + "/public/index.html");
});
app.listen(port,()=>{
    console.log(`Listening on port ${port}`);
});