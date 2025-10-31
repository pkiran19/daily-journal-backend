import bcrypt from "bcrypt";
import dbPromise from "./db.js";

export async function registerUser(username, password) {
  const db = await dbPromise;
  const hashedPassword = await bcrypt.hash(password, 10);
  try {
    await db.run("INSERT INTO users (username, password) VALUES (?, ?)", [username, hashedPassword]);
    return { success: true };
  } catch {
    return { success: false, message: "Username already exists" };
  }
}

export async function loginUser(username, password) {
  const db = await dbPromise;
  const user = await db.get("SELECT * FROM users WHERE username = ?", [username]);
  if (user && (await bcrypt.compare(password, user.password))) {
    return { success: true, userId: user.id };
  }
  return { success: false, message: "Invalid credentials" };
}
