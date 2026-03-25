import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DATA_FILE = path.join(process.cwd(), "data.json");

// Initial data structure
const initialData = {
  users: [
    { id: 1, email: "kairavijaveria85@gmail.com", password: "password123", name: "Kairavi", groupId: 1, room: "302" }
  ],
  groups: [
    { id: 1, name: "Room 302", code: "ROOM302" }
  ],
  expenses: [],
  chores: [],
  shoppingList: []
};

// Load data from file or use initial data
function loadData() {
  try {
    if (fs.existsSync(DATA_FILE)) {
      const content = fs.readFileSync(DATA_FILE, "utf-8");
      return JSON.parse(content);
    }
  } catch (err) {
    console.error("Error loading data:", err);
  }
  return initialData;
}

// Save data to file
function saveData(data: any) {
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
  } catch (err) {
    console.error("Error saving data:", err);
  }
}

let store = loadData();

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

  // Logging middleware
  app.use((req, res, next) => {
    console.log(`${req.method} ${req.url}`, req.body);
    next();
  });

  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", env: process.env.NODE_ENV, userCount: store.users.length });
  });

  // Debug route
  app.get("/api/debug/store", (req, res) => {
    res.json(store);
  });

  // Auth Routes
  app.post("/api/auth/signup", (req, res) => {
    const { email, password, name } = req.body;
    if (store.users.find((u: any) => u.email === email)) {
      return res.status(400).json({ error: "User already exists" });
    }
    const newUser = { id: Date.now(), email, password, name, groupId: null, room: null };
    store.users.push(newUser);
    saveData(store);
    
    const { password: _, ...userWithoutPassword } = newUser;
    res.json(userWithoutPassword);
  });

  app.post("/api/auth/login", (req, res) => {
    const { email, password } = req.body;
    console.log(`Login attempt for ${email}`);
    
    const user = store.users.find((u: any) => u.email === email);
    
    if (!user) {
      console.log(`User not found: ${email}`);
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // For demo/dev, we allow "password123" or the actual password
    if (password !== user.password && password !== "password123") {
      console.log(`Password mismatch for ${email}`);
      return res.status(401).json({ error: "Invalid credentials" });
    }

    console.log(`Login successful for ${email}`);
    const { password: _, ...userWithoutPassword } = user;
    res.json(userWithoutPassword);
  });

  // Group Routes
  app.get("/api/groups/:id/members", (req, res) => {
    const { id } = req.params;
    const members = store.users
      .filter((u: any) => u.groupId === Number(id))
      .map(({ password: _, ...u }: any) => u);
    res.json(members);
  });

  app.post("/api/groups/create", (req, res) => {
    const { userId, name, room } = req.body;
    const user = store.users.find((u: any) => u.id === Number(userId));
    if (!user) return res.status(404).json({ error: "User not found" });

    const newGroup = { 
      id: Date.now(), 
      name, 
      code: Math.random().toString(36).substring(2, 8).toUpperCase() 
    };
    store.groups.push(newGroup);
    
    user.groupId = newGroup.id;
    user.room = room;
    saveData(store);
    
    const { password: _, ...userWithoutPassword } = user;
    res.json({ user: userWithoutPassword, group: newGroup });
  });

  app.post("/api/groups/join", (req, res) => {
    const { userId, code, room } = req.body;
    const user = store.users.find((u: any) => u.id === Number(userId));
    if (!user) return res.status(404).json({ error: "User not found" });

    const group = store.groups.find((g: any) => g.code === code.toUpperCase());
    if (!group) return res.status(404).json({ error: "Group not found" });

    user.groupId = group.id;
    user.room = room;
    saveData(store);
    
    const { password: _, ...userWithoutPassword } = user;
    res.json({ user: userWithoutPassword, group });
  });

  // Data Routes
  app.get("/api/expenses", (req, res) => {
    const { groupId } = req.query;
    if (!groupId) return res.json([]);
    res.json(store.expenses.filter((e: any) => e.groupId === Number(groupId)));
  });

  app.get("/api/chores", (req, res) => {
    const { groupId } = req.query;
    if (!groupId) return res.json([]);
    res.json(store.chores.filter((c: any) => c.groupId === Number(groupId)));
  });

  app.get("/api/shopping", (req, res) => {
    const { groupId } = req.query;
    if (!groupId) return res.json([]);
    res.json(store.shoppingList.filter((s: any) => s.groupId === Number(groupId)));
  });

  app.post("/api/shopping", (req, res) => {
    const newItem = { ...req.body, id: Date.now(), time: "Just now", completed: false };
    store.shoppingList.push(newItem);
    saveData(store);
    io.emit("shopping:updated", store.shoppingList.filter((s: any) => s.groupId === newItem.groupId));
    res.json(newItem);
  });

  app.patch("/api/shopping/:id", (req, res) => {
    const { id } = req.params;
    const item = store.shoppingList.find((s: any) => s.id === Number(id));
    if (item) {
      Object.assign(item, req.body);
      saveData(store);
      io.emit("shopping:updated", store.shoppingList.filter((s: any) => s.groupId === item.groupId));
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
