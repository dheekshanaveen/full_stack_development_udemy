import express from "express";
import bodyParser from "body-parser";
import pg from "pg";
const db = new pg.Client({
  user: "postgres",
  host: "localhost",
  database: "world",
  password: "SamsungS24FE",
  port: 5432,
});
db.connect();
const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

app.get("/", async (req, res) => {
  const result = await db.query("SELECT country_code FROM visited_countries");
  let countries = [];
  result.rows.forEach((country) => {
    countries.push(country.country_code);
  });
  res.render("index.ejs", { countries: countries, total: countries.length });
});
app.post("/add", async (req, res) => {
  const input = req.body.country.trim().toLowerCase();

  try {
    // 1. Try an exact match first so "india" doesn't collide with "Indian Ocean"
    let result = await db.query(
      "SELECT country_code FROM countries WHERE LOWER(country_name) = $1;",
      [input]
    );

    // 2. Fall back to partial match only if no exact match was found
    if (result.rows.length === 0) {
      result = await db.query(
        "SELECT country_code FROM countries WHERE LOWER(country_name) LIKE '%' || $1 || '%';",
        [input]
      );
    }

    if (result.rows.length === 0) {
      const countries = await checkVisited();
      return res.render("index.ejs", {
        countries,
        total: countries.length,
        error: "Country name does not exist, try again.",
      });
    }

    const countryCode = result.rows[0].country_code.trim();

    // 3. Insert safely (catches duplicate country errors without crashing)
    try {
      await db.query(
        "INSERT INTO visited_countries (country_code) VALUES ($1);",
        [countryCode]
      );
      res.redirect("/");
    } catch (err) {
      console.error("Insert error:", err.message);
      const countries = await checkVisited();
      res.render("index.ejs", {
        countries,
        total: countries.length,
        error: "Country has already been added, try again.",
      });
    }
  } catch (err) {
    console.error("Query error:", err.message);
    const countries = await checkVisited();
    res.render("index.ejs", {
      countries,
      total: countries.length,
      error: "Something went wrong, try again.",
    });
  }
});
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
