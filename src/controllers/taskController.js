const fs = require('fs');
const path = require('path');

const DATA_FILE = path.join(__dirname, '..', 'data', 'tasks.json');

const readTasks = () => {
  const data = fs.readFileSync(DATA_FILE, 'utf-8');
  return JSON.parse(data);
};

const writeTasks = (tasks) => {
  fs.writeFileSync(DATA_FILE, JSON.stringify(tasks, null, 2));
};

// GET /tasks
const getAllTasks = (req, res) => {
  const tasks = readTasks();
  res.status(200).json(tasks);
};

// GET /tasks/:id
const getTaskById = (req, res) => {
  const tasks = readTasks();
  const task = tasks.find((t) => t.id === Number(req.params.id));

  if (!task) {
    return res.status(404).json({ message: 'Görev bulunamadı' });
  }
  res.status(200).json(task);
};

// POST /tasks
const createTask = (req, res) => {
  const { title, description, status, priority, assignee } = req.body || {};

  if (!title) {
    return res.status(400).json({ message: 'title alanı zorunludur' });
  }

  const tasks = readTasks();
  const now = new Date().toISOString();

  const newTask = {
    id: tasks.length > 0 ? Math.max(...tasks.map((t) => t.id)) + 1 : 1,
    title,
    description: description || '',
    status: status || 'pending',
    priority: priority || 'medium',
    assignee: assignee || '',
    createdAt: now,
    updatedAt: now,
  };

  tasks.push(newTask);
  writeTasks(tasks);
  res.status(201).json(newTask);
};

// PUT /tasks/:id
const updateTask = (req, res) => {
  const tasks = readTasks();
  const index = tasks.findIndex((t) => t.id === Number(req.params.id));

  if (index === -1) {
    return res.status(404).json({ message: 'Görev bulunamadı' });
  }

  const allowedFields = ['title', 'description', 'status', 'priority', 'assignee'];
  const updates = {};
  allowedFields.forEach((field) => {
    if (req.body && req.body[field] !== undefined) {
      updates[field] = req.body[field];
    }
  });

  if (updates.title !== undefined && !updates.title) {
    return res.status(400).json({ message: 'title boş olamaz' });
  }

  tasks[index] = {
    ...tasks[index],
    ...updates,
    updatedAt: new Date().toISOString(),
  };

  writeTasks(tasks);
  res.status(200).json(tasks[index]);
};

// DELETE /tasks/:id
const deleteTask = (req, res) => {
  const tasks = readTasks();
  const index = tasks.findIndex((t) => t.id === Number(req.params.id));

  if (index === -1) {
    return res.status(404).json({ message: 'Görev bulunamadı' });
  }

  const [deletedTask] = tasks.splice(index, 1);
  writeTasks(tasks);
  res.status(200).json({ message: 'Görev silindi', task: deletedTask });
};

module.exports = {
  getAllTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
};