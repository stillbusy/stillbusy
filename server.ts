import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";
import Database from "better-sqlite3";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const db = new Database("survivespace.db");

// Initialize database
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT UNIQUE,
    password TEXT,
    name TEXT,
    groupId INTEGER,
    room TEXT
  );

  CREATE TABLE IF NOT EXISTS groups (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    code TEXT UNIQUE
  );

  CREATE TABLE IF NOT EXISTS expenses (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    groupId INTEGER,
    name TEXT,
    amount REAL,
    date TEXT,
    status TEXT,
    participants INTEGER
  );

  CREATE TABLE IF NOT EXISTS chores (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    groupId INTEGER,
    title TEXT,
    assignee TEXT,
    dueDate TEXT,
    status TEXT,
    priority TEXT
  );

  CREATE TABLE IF NOT EXISTS shopping_list (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    groupId INTEGER,
    name TEXT,
    qty TEXT,
    category TEXT,
    time TEXT,
    completed INTEGER DEFAULT 0
  );
`);

// Seed default user if not exists
const seedUser = db.prepare("SELECT * FROM users WHERE email = ?").get("kairavijaveria85@gmail.com");
if (!seedUser) {
  db.prepare("INSERT INTO users (email, name, password) VALUES (?, ?, ?)").run(
    "kairavijaveria85@gmail.com",
    "Kairavi",
    "password123"
  );
}

// Seed default group if not exists
const seedGroup = db.prepare("SELECT * FROM groups WHERE code = ?").get("ROOM302");
if (!seedGroup) {
  const result = db.prepare("INSERT INTO groups (name, code) VALUES (?, ?)").run("Room 302", "ROOM302");
  db.prepare("UPDATE users SET groupId = ?, room = ? WHERE email = ?").run(result.lastInsertRowid, "302", "kairavijaveria85@gmail.com");
}

async function startServer() {
  const app = express();
  const httpServer = createServer(app);
  const io = new Server(httpServer, {
    cors: {
      origin: "*",
    },
  });

  const PORT = 3000;

  app.use(express.json());

  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", env: process.env.NODE_ENV });
  });

  // Auth Routes
  app.post("/api/auth/signup", (req, res) => {
    const { email, password, name } = req.body;
    try {
      const result = db.prepare("INSERT INTO users (email, password, name) VALUES (?, ?, ?)").run(email, password, name);
      const newUser = db.prepare("SELECT id, email, name, groupId, room FROM users WHERE id = ?").get(result.lastInsertRowid);
      res.json(newUser);
    } catch (err: any) {
      if (err.message.includes("UNIQUE constraint failed")) {
        return res.status(400).json({ error: "User already exists" });
      }
      res.status(500).json({ error: "Signup failed" });
    }
  });

  app.post("/api/auth/login", (req, res) => {
    const { email, password } = req.body;
    const user = db.prepare("SELECT id, email, name, groupId, room FROM users WHERE email = ?").get(email);
    if (!user) {
      return res.status(401).json({ error: "Invalid credentials" });
    }
    // In a real app, we'd check the password hash here
    res.json(user);
  });

  // Group Routes
  app.get("/api/groups/:id/members", (req, res) => {
    const { id } = req.params;
    const members = db.prepare("SELECT id, name, email, room FROM users WHERE groupId = ?").all(id);
    res.json(members);
  });

  app.post("/api/groups/create", (req, res) => {
    const { userId, name, room } = req.body;
    try {
      const code = Math.random().toString(36).substring(2, 8).toUpperCase();
      const result = db.prepare("INSERT INTO groups (name, code) VALUES (?, ?)").run(name, code);
      const groupId = result.lastInsertRowid;
      
      db.prepare("UPDATE users SET groupId = ?, room = ? WHERE id = ?").run(groupId, room, userId);
      
      const user = db.prepare("SELECT id, email, name, groupId, room FROM users WHERE id = ?").get(userId);
      const group = db.prepare("SELECT * FROM groups WHERE id = ?").get(groupId);
      
      res.json({ user, group });
    } catch (err) {
      res.status(500).json({ error: "Group creation failed" });
    }
  });

  app.post("/api/groups/join", (req, res) => {
    const { userId, code, room } = req.body;
    const group = db.prepare("SELECT * FROM groups WHERE code = ?").get(code.toUpperCase());
    if (!group) return res.status(404).json({ error: "Group not found" });

    db.prepare("UPDATE users SET groupId = ?, room = ? WHERE id = ?").run(group.id, room, userId);
    const user = db.prepare("SELECT id, email, name, groupId, room FROM users WHERE id = ?").get(userId);
    
    res.json({ user, group });
  });

  // Data Routes
  app.get("/api/expenses", (req, res) => {
    const { groupId } = req.query;
    if (!groupId) return res.json([]);
    const result = db.prepare("SELECT * FROM expenses WHERE groupId = ?").all(groupId);
    res.json(result);
  });

  app.get("/api/chores", (req, res) => {
    const { groupId } = req.query;
    if (!groupId) return res.json([]);
    const result = db.prepare("SELECT * FROM chores WHERE groupId = ?").all(groupId);
    res.json(result);
  });

  app.get("/api/shopping", (req, res) => {
    const { groupId } = req.query;
    if (!groupId) return res.json([]);
    const result = db.prepare("SELECT * FROM shopping_list WHERE groupId = ?").all(groupId);
    res.json(result.map((s: any) => ({ ...s, completed: !!s.completed })));
  });

  app.post("/api/shopping", (req, res) => {
    const { groupId, name, qty, category } = req.body;
    const time = "Just now";
    const result = db.prepare("INSERT INTO shopping_list (groupId, name, qty, category, time) VALUES (?, ?, ?, ?, ?)").run(
      groupId, name, qty, category, time
    );
    const newItem = db.prepare("SELECT * FROM shopping_list WHERE id = ?").get(result.lastInsertRowid);
    
    const allItems = db.prepare("SELECT * FROM shopping_list WHERE groupId = ?").all(groupId);
    io.emit("shopping:updated", allItems.map((s: any) => ({ ...s, completed: !!s.completed })));
    
    res.json({ ...newItem, completed: !!newItem.completed });
  });

  app.patch("/api/shopping/:id", (req, res) => {
    const { id } = req.params;
    const { completed } = req.body;
    db.prepare("UPDATE shopping_list SET completed = ? WHERE id = ?").run(completed ? 1 : 0, id);
    
    const item = db.prepare("SELECT groupId FROM shopping_list WHERE id = ?").get(id);
    if (item) {
      const allItems = db.prepare("SELECT * FROM shopping_list WHERE groupId = ?").all(item.groupId);
      io.emit("shopping:updated", allItems.map((s: any) => ({ ...s, completed: !!s.completed })));
    }
    
    res.json({ success: true });
  });

  // Socket.io logic
  io.on("connection", (socket) => {
    console.log("User connected:", socket.id);
    socket.on("disconnect", () => {
      console.log("User disconnected");
    });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, "dist")));
    app.get("*", (req, res) => {
      res.sendFile(path.join(__dirname, "dist", "index.html"));
    });
  }

  httpServer.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
  
  return app;
}

const appPromise = startServer();
export default appPromise;
