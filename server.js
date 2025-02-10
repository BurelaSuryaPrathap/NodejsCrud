import express from "express";
import mysql from "mysql2";
import cors from "cors";

const app = express();
app.use(express.json());
app.use(cors());


const db = mysql.createConnection({
  host: "localhost",
  user: "root", 
  password: "password",
  database: "blogdb",
});

db.connect((err) => {
  if (err) {
    console.error("Database Connection Failed:", err);
  } else {
    console.log("✅ Connected to MySQL Database");
  }
});


app.get("/api/blogs", (req, res) => {
  db.query("SELECT * FROM blogs", (err, result) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(result);
  });
});

app.post("/api/blogs", (req, res) => {
  const { title, image, content } = req.body;
  db.query(
    "INSERT INTO blogs (title, image, content) VALUES (?, ?, ?)",
    [title, image, content],
    (err, result) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.json({ id: result.insertId, title, image, content });
    }
  );
});

app.delete("/api/blogs/:id", (req, res) => {
  const { id } = req.params;
  db.query("DELETE FROM blogs WHERE id = ?", [id], (err) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json({ message: "Blog deleted successfully" });
  });
});


const PORT = 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
