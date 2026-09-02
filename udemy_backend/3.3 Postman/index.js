import express from "express";
const app = express();
const port = 3000;

// *********************
// Let’s practice using Postman. Make sure your server is running with nodemon.
// Then test the 5 different routes below with Postman. Open a separate tab for each request.
// Check that for each route you’re getting the correct status code returned to you from your server.
// You should not get any 404s or 500 status codes.
// *********************

app.get("/", (req, res) => {
  res.send("<h1>Home Page</h1>");
});

app.post("/register", (req, res) => {
  res.status(201)
  res.send("<h1>Registration Page</h1>");
});

app.put("/user", (req, res) => {
  res.status(200)
  res.send("<h1>User Updated</h1>");
});

app.patch("/update", (req, res) => {
  res.status(200).send("<h1>User Partially Updated</h1>");
});

app.delete("/dele", (req, res) => {
  // Deleting
  res.status(200).send("<h1>User Deleted</h1>");
});

app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
