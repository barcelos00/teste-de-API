import express from "express";
import bodyParser from "body-parser";
import fs from "fs";
import path from "path";

const app = express();
const PORT = 3000;

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "../public")));

const DB_FILE = path.join(__dirname, "database.json");

interface User {
  username: string;
  password: string;
}

function getUsers(): User[] {
  if (!fs.existsSync(DB_FILE)) {
    fs.writeFileSync(DB_FILE, "[]", "utf-8"); // cria o arquivo vazio se não existir
  }
  const data = fs.readFileSync(DB_FILE, "utf-8");
  return JSON.parse(data);
}

function saveUsers(users: User[]) {
  fs.writeFileSync(DB_FILE, JSON.stringify(users, null, 2));
}

app.post("/register", (req, res) => {
  const { username, password } = req.body;
  const users = getUsers();

  if (users.find(u => u.username === username)) {
    return res.status(400).send("Usuário já existe");
  }

  users.push({ username, password });
  saveUsers(users);
  res.send("Usuário registrado com sucesso!");
});

app.post("/login", (req, res) => {
  const { username, password } = req.body;
  const users = getUsers();

  const user = users.find(u => u.username === username && u.password === password);
  if (user) {
    res.send("Login bem-sucedido!");
  } else {
    res.status(401).send("Usuário ou senha inválidos");
  }
});

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
