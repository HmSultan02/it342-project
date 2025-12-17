import express from "express";
import { Pool } from "pg";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import * as dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const app = express();
const PORT = process.env.PORT || 3001;

/* ============================
   DATABASE CONNECTION
============================ */
const pool = new Pool({
  host: process.env.PG_HOST,
  user: process.env.PG_USER,
  password: process.env.PG_PASSWORD,
  database: process.env.PG_DATABASE,
  port: Number(process.env.PG_PORT || 5432),
  ssl: { rejectUnauthorized: false }
});

const JWT_SECRET = process.env.NEXTAUTH_SECRET || "dev-secret";

/* ============================
   MIDDLEWARE
============================ */
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, POST");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next();
});

/* ============================
   SIGN UP
============================ */
app.post("/api/signup", async (req, res) => {
  const { userid, password } = req.body;

  if (!userid || !password) {
    return res.status(400).json({ message: "Missing fields" });
  }

  try {
    const hashed = await bcrypt.hash(password, 10);

    const result = await pool.query(
      `INSERT INTO users (userid, password)
       VALUES ($1, $2)
       RETURNING userid`,
      [userid, hashed]
    );

    res.status(201).json({
      message: "Account created",
      user: result.rows[0]
    });
  } catch (err) {
    if (err.code === "23505") {
      return res.status(409).json({ message: "User already exists" });
    }
    res.status(500).json({ message: "Server error" });
  }
});

/* ============================
   SIGN IN
============================ */
app.post("/api/auth/signin", async (req, res) => {
  const { userid, password } = req.body;

  if (!userid || !password) {
    return res.status(401).json({ message: "Missing credentials" });
  }

  try {
    const result = await pool.query(
      `SELECT userid, password FROM users WHERE LOWER(userid) = LOWER($1)`,
      [userid]
    );

    const user = result.rows[0];
    if (!user) {
      return res.status(401).json({ message: "Invalid login" });
    }

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      return res.status(401).json({ message: "Invalid login" });
    }

    const token = jwt.sign({ userid }, JWT_SECRET, { expiresIn: "7d" });

    res.json({
      message: "Login successful",
      token,
      user: { userid }
    });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

/* ============================
   USER SEARCH (BACKEND SEARCH)
============================ */
app.get("/api/search/users", async (req, res) => {
  const q = String(req.query.q || "").trim();

  if (!q) {
    return res.json({ results: [] });
  }

  try {
    const result = await pool.query(
      `
      SELECT userid
      FROM users
      WHERE userid ILIKE $1
      ORDER BY userid
      LIMIT 20
      `,
      [`%${q}%`]
    );

    res.json({ results: result.rows });
  } catch (err) {
    console.error("User search error:", err);
    res.status(500).json({ message: "Search failed" });
  }
});

/* ============================
   START SERVER
============================ */
app.listen(PORT, () => {
  console.log(`API running on port ${PORT}`);
});