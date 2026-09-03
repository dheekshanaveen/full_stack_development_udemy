const fs =require('fs');
const filename = "data.txt";

fs.writeFileSync(filename,'Hello i created the file!!');
console.log("File is created!!");

let content = fs.readFileSync(filename,'utf8');
console.log("File read sucesfully");

fs.appendFileSync(filename, '\nThis is appended text.\n');
console.log("File Updated.");