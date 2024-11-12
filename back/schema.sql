CREATE DATABASE todo_list;

USE todo_list;

CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255),
    Email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255)
);



CREATE TABLE todos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255),
    completed BOOLEAN DEFAULT false,
    user_id INT NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);



CREATE TABLE shared_todos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    todo_id INT,
    user_id INT,
    shared_with_id INT,
    FOREIGN key (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (todo_id) REFERENCES todos(id) ON DELETE CASCADE,
    FOREIGN KEY (shared_with_id) REFERENCES users(id) ON DELETE CASCADE
);



INSERT INTO users (name, Email, password) VALUES ('Franco', 'Stebefranco@gmail.com', '42562169');
INSERT INTO users (name, Email, password) VALUES ('Martu', 'MartuVillegas@gmail.com', '44953736');



INSERT INTO todos (title, user_id)
VALUES
("Lavar la ropa", 1),
("Terminar el proyecto", 1),
("salir a correr", 1),
("Cocinar", 1),
("Estudiar Biologia", 1),
("Peinarme", 1);



INSERT INTO shared_todos (todo_id, user_id, shared_with_id)
VALUES (1, 1, 2);



SELECT todos.*, shared_todos.shared_with_id
FROM todos
LEFT JOIN shared_todos ON todos.id = shared_todos.todo_id
WHERE todos.user_id = [user_id] OR shared_todos.shared_with_id = [user_id];
