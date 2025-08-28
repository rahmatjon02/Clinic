import express from "express";
import fs from "fs";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

const db = JSON.parse(fs.readFileSync("db.json", "utf-8"));

// Логин
app.post("/auth/login", (req, res) => {
  const { userName, password } = req.body;

  const user = db.users.find(
    (u) => u.userName === userName && u.password === password
  );

  if (!user) {
    return res.status(401).json({ message: "Неверный логин или пароль" });
  }

  // Генерация токена
  const token = `fake-token-${Date.now()}`;

  res.json({
    accessToken: token,
    user: {
      id: user.id,
      userName: user.userName,
      name: user.name,
      email: user.email,
      role: user.role,
    },
  });
});

// Проверка всех пользователей
app.get("/users", (req, res) => {
  res.json(db.users);
});

app.listen(5000, () =>
  console.log("🚀 Server running on http://localhost:5000")
);
