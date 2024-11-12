import express from "express";
import {
    getTodosById,
    getTodo,
    getSharedTodoBy,
    getUserBy,
    getUserByEmail,
    createTodo,
    deleteTodo,
    tareaCompleta,
    sharedTodos
} from "./dataBase.js";
import cors from 'cors';


const corsOption = {
    origin: ["http://192.168.0.6:8081", "http://localhost:8081"], // Agrega los orígenes que necesites
    methods: ["POST", "GET"],
    credentials: true,
};

const app = express();
app.use(express.json());
app.use(cors(corsOption));

app.get("/todos/:id", async (req, res) => {
    const todos = await getTodosById(req.params.id);
    res.status(200).send(todos);
});

app.get("/todos/shared_todos/:id", async (req, res) =>{
    const todo = await getSharedTodoBy(req.params.id);
    const author = await getUserBy(todo.user_id);
    const shared_whith =  getUserBy(todo.shared_whith_id);
    res.status(200).send({author, shared_whith});
});

app.get("/user/:id", async (req, res) =>{
const user = await getUserBy(req.params.id);
res.status(200).send(user);
});

app.put("/todos/:id", async (req, res) =>{
    const {value} = req.body;
    const todo = await tareaCompleta(req.params.id, value);
    res.status(200).send(todo);
});

app.delete("/todos/:id", async (req, res) => {
    await deleteTodo(req.params.id);
    res.status({ message: " Tarea Eliminada"});
});

app.post("/todos/shared_todos", async (req, res) =>{
const {todo_id, user_id, email} = req.body;
const userToShare = await getUserByEmail(email);
const sharedTodo = await sharedTodos(todo_id, user_id, userToShare.id);
res.status(201).send(sharedTodo);
});

app.post("/todos", async (req, res) =>{
    const {user_id, title} = req.body;
    const todo = await createTodo(user_id, title);
    res.status(201).send(todo);
});

app.listen(8080, ()=>{
    console.log("server in port 8080")
});