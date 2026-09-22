import express from "express";

const app = express();
const port = 3000;

// Store blog posts in memory
const posts = [];

// EJS
app.set("view engine", "ejs");

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

// HOME PAGE
app.get("/", (req, res) => {
  res.render("index.ejs", {
    posts: posts,
  });
});

// CREATE PAGE
app.get("/create", (req, res) => {
  res.render("create.ejs");
});

// CREATE POST
app.post("/create", (req, res) => {
  const newPost = {
    id: Date.now(),
    title: req.body.title,
    content: req.body.content,
  };

  posts.push(newPost);

  res.redirect("/");
});

// EDIT PAGE
app.get("/edit/:id", (req, res) => {
  const post = posts.find((post) => post.id === Number(req.params.id));

  res.render("edit.ejs", {
    post: post,
  });
});

// UPDATE POST
app.post("/edit/:id", (req, res) => {
  const post = posts.find((post) => post.id === Number(req.params.id));

  post.title = req.body.title;
  post.content = req.body.content;

  res.redirect("/");
});

// DELETE POST
app.post("/delete/:id", (req, res) => {
  const postIndex = posts.findIndex(
    (post) => post.id === Number(req.params.id),
  );

  posts.splice(postIndex, 1);

  res.redirect("/");
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
