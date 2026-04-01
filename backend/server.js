import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import pool from "./db/index.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// ── Middleware ───────────────────────────────────────────────────────────────
app.use(express.json());
app.use(
  cors({
    origin: process.env.FRONTEND_ORIGIN || "http://localhost:5173",
    methods: ["GET", "POST"],
  })
);

// ── Health check ─────────────────────────────────────────────────────────────
app.get("/health", (_req, res) => res.json({ status: "ok" }));

// ── POST /api/contact ─────────────────────────────────────────────────────────
// Stores a new enquiry from the contact form
app.post("/api/contact", async (req, res) => {
  const { name, business, email, phone, service, message } = req.body;

  // Basic validation
  if (!name || !email || !service || !message) {
    return res.status(400).json({ error: "name, email, service, and message are required." });
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({ error: "Invalid email address." });
  }

  const ip = req.headers["x-forwarded-for"]?.split(",")[0].trim() || req.socket.remoteAddress;

  try {
    const result = await pool.query(
      `INSERT INTO enquiries (name, business, email, phone, service, message, ip_address)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING id, created_at`,
      [
        name.trim(),
        business?.trim() || null,
        email.trim().toLowerCase(),
        phone?.trim() || null,
        service.trim(),
        message.trim(),
        ip,
      ]
    );

    const { id, created_at } = result.rows[0];
    console.log(`[${created_at.toISOString()}] New enquiry #${id} from ${email}`);

    return res.status(201).json({ success: true, id });
  } catch (err) {
    console.error("DB error saving enquiry:", err);
    return res.status(500).json({ error: "Failed to save your message. Please try again." });
  }
});

// ── GET /api/enquiries ────────────────────────────────────────────────────────
// Returns all enquiries — requires X-Admin-Key header matching ADMIN_API_KEY env var
app.get("/api/enquiries", async (req, res) => {
  const adminKey = process.env.ADMIN_API_KEY;
  if (!adminKey || req.headers["x-admin-key"] !== adminKey) {
    return res.status(401).json({ error: "Unauthorized." });
  }
  try {
    const result = await pool.query(
      `SELECT id, name, business, email, phone, service, message, created_at
       FROM enquiries
       ORDER BY created_at DESC`
    );
    return res.json(result.rows);
  } catch (err) {
    console.error("DB error fetching enquiries:", err);
    return res.status(500).json({ error: "Failed to retrieve enquiries." });
  }
});

// ── Start ─────────────────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`Web Quokka backend running on http://localhost:${PORT}`);
});
