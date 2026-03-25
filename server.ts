import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import { createServer as createViteServer } from "vite";
import path from "path";

async function startServer() {
  const app = express();
  const httpServer = createServer(app);
  const io = new Server(httpServer, {
    cors: {
      origin: "*",
    },
  });

  const PORT = 3000;

  // In-memory state for demo purposes
  let users = [
    { id: 1, email: "kairavijaveria85@gmail.com", name: "Kairavi", groupId: 1, room: "302" },
  ];

  let groups = [
    { id: 1, name: "Room 302", code: "ROOM302" },
  ];

  let expenses: any[] = [];
  let chores: any[] = [];
  let shoppingList: any[] = [];

  app.use(express.json());

  // Group Routes
  app.get("/api/groups/:id/members", (req, res) => {
    const { id } = req.params;
    const members = users.filter(u => u.groupId === Number(id));
    res.json(members);
  });

  // Auth Routes
  app.post("/api/auth/signup", (req, res) => {
    const { email, password, name } = req.body;
    if (users.find(u => u.email === email)) {
      return res.status(400).json({ error: "User already exists" });
    }
    const newUser = { id: users.length + 1, email, name, groupId: null, room: null };
    users.push(newUser);
    res.json(newUser);
  });

  app.post("/api/auth/login", (req, res) => {
    const { email, password } = req.body;
    const user = users.find(u => u.email === email);
    if (!user) {
      return res.status(401).json({ error: "Invalid credentials" });
    }
    res.json(user);
  });

  // Group Routes
  app.post("/api/groups/create", (req, res) => {
    const { userId, name, room } = req.body;
    const user = users.find(u => u.id === userId);
    if (!user) return res.status(404).json({ error: "User not found" });

    const newGroup = { 
      id: groups.length + 1, 
      name, 
      code: Math.random().toString(36).substring(2, 8).toUpperCase() 
    };
    groups.push(newGroup);
    
    user.groupId = newGroup.id;
    user.room = room;
    
    res.json({ user, group: newGroup });
  });

  app.post("/api/groups/join", (req, res) => {
    const { userId, code, room } = req.body;
    const user = users.find(u => u.id === userId);
    if (!user) return res.status(404).json({ error: "User not found" });

    const group = groups.find(g => g.code === code.toUpperCase());
    if (!group) return res.status(404).json({ error: "Group not found" });

    user.groupId = group.id;
    user.room = room;
    
    res.json({ user, group });
  });

  // Data Routes
  app.get("/api/expenses", (req, res) => {
    const { groupId } = req.query;
    if (!groupId) return res.json([]);
    res.json(expenses.filter(e => e.groupId === Number(groupId)));
  });

  app.get("/api/chores", (req, res) => {
    const { groupId } = req.query;
    if (!groupId) return res.json([]);
    res.json(chores.filter(c => c.groupId === Number(groupId)));
  });

  app.get("/api/shopping", (req, res) => {
    const { groupId } = req.query;
    if (!groupId) return res.json([]);
    res.json(shoppingList.filter(s => s.groupId === Number(groupId)));
  });

  app.post("/api/shopping", (req, res) => {
    const newItem = { ...req.body, id: Date.now(), time: "Just now", completed: false };
    shoppingList.push(newItem);
    io.emit("shopping:updated", shoppingList);
    res.json(newItem);
  });

  app.patch("/api/shopping/:id", (req, res) => {
    const { id } = req.params;
    shoppingList = shoppingList.map(item => 
      item.id === Number(id) ? { ...item, ...req.body } : item
    );
    io.emit("shopping:updated", shoppingList);
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
}

startServer();
