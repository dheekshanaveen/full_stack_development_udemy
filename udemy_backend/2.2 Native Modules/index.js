const fs =require('fs');
const filename = "file.txt";

fs.writeFile(filename, "hello fron node js",(err) => { 
    if (err) throw err; 
    console.log("file created succesfully");
});
 
