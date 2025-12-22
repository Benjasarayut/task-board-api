require('dotenv').config();
const express = require('express');
const path = require('path');
const taskController = require('./src/controllers/taskController');
const database = require('./database/connection');
const errorHandler = require('./src/middleware/errorHandler');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// API Routes
app.get('/api/health', (req, res) => res.json({ status: 'ok', msg: 'Layered App Online!' }));
app.get('/api/tasks', taskController.getAllTasks);
app.get('/api/tasks/:id', taskController.getTaskById);
app.post('/api/tasks', taskController.createTask);
app.put('/api/tasks/:id', taskController.updateTask);
app.delete('/api/tasks/:id', taskController.deleteTask);

app.get('/', (req, res) => res.sendFile(path.join(__dirname, 'public', 'index.html')));

app.use(errorHandler);

app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
    console.log('✅ Architecture: Layered');
});
