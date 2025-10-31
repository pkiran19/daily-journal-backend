import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { initDB } from "./db.js";
import { registerUser, loginUser } from "./auth.js";
import { addEntry, getEntries } from "./journal.js";

const app = express();
const PORT = 4000;

await initDB();

app.use(express.json());
app.use(cookieParser());
app.use(cors({
  origin: ["http://localhost:5500", "https://<your-username>.github.io"],
  credentials: true
}));

app.post("/api/register", async (req, res) => {
  const { username, password } = req.body;
  const result = await registerUser(username, password);
  res.json(result);
});

app.post("/api/login", async (req, res) => {
  const { username, password } = req.body;
  const result = await loginUser(username, password);
  if (result.success) {
    res.cookie("userId", result.userId, { httpOnly: true, sameSite: "lax" });
  }
  res.json(result);
});

app.post("/api/logout", (req, res) => {
  res.clearCookie("userId");
  res.json({ success: true });
});

app.post("/api/journal", async (req, res) => {
  const userId = req.cookies.userId;
  if (!userId) return res.status(401).json({ message: "Not logged in" });
  const { title, content } = req.body;
  await addEntry(userId, title, content);
  res.json({ success: true });
});

app.get("/api/journal", async (req, res) => {
  const userId = req.cookies.userId;
  if (!userId) return res.status(401).json({ message: "Not logged in" });
  const entries = await getEntries(userId);
  res.json(entries);
});

app.listen(PORT, () => console.log(`✅ Backend running at http://localhost:${PORT}`));
