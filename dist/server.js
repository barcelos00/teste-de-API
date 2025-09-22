"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const app = (0, express_1.default)();
const PORT = 3000;
app.use(body_parser_1.default.json());
app.use(express_1.default.static(path_1.default.join(__dirname, "../public")));
const DB_FILE = path_1.default.join(__dirname, "database.json");
function getUsers() {
    if (!fs_1.default.existsSync(DB_FILE)) {
        fs_1.default.writeFileSync(DB_FILE, "[]", "utf-8"); // cria o arquivo vazio se não existir
    }
    const data = fs_1.default.readFileSync(DB_FILE, "utf-8");
    return JSON.parse(data);
}
function saveUsers(users) {
    fs_1.default.writeFileSync(DB_FILE, JSON.stringify(users, null, 2));
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
    }
    else {
        res.status(401).send("Usuário ou senha inválidos");
    }
});
app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});
