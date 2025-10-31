import dbPromise from "./db.js";

export async function addEntry(userId, title, content) {
  const db = await dbPromise;
  const date = new Date().toLocaleString();
  await db.run("INSERT INTO journal (user_id, title, content, date) VALUES (?, ?, ?, ?)", [userId, title, content, date]);
}

export async function getEntries(userId) {
  const db = await dbPromise;
  return db.all("SELECT * FROM journal WHERE user_id = ? ORDER BY id DESC", [userId]);
}
