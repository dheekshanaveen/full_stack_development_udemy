import express from "express";

const app = express();
const port = 3000;
app.set("view engine", "ejs");

app.get("/", (req, res) => {
  const today = new Date("2026-09-12T00:00:00");
  const day = today.getDay();
  let type = "Weekday";
  let advice = "Time to work!";
  if (day === 0 || day === 6) {
    type = "Weekend";
    advice = "Time to relax!";
  }
  res.render("index.ejs", { dayType: type, advice: advice });
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
