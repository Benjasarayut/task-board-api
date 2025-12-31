const taskRepository = require('../repositories/taskRepository');
const Task = require('../models/Task');

class TaskService {
    async getAllTasks(filters) {
        const tasks = await taskRepository.findAll(filters);
        return tasks.map(task => task.toJSON());
    }

    async getTaskById(id) {
        const task = await taskRepository.findById(id);
        if (!task) throw new Error('Task not found');
        return task.toJSON();
    }

    async createTask(taskData) {
        // 🔥 แปลงข้อมูลดิบให้เป็น Class Task ก่อนส่งไป Repository
        const newTask = new Task(taskData);
        
        // (เผื่ออยาก validate ก็ทำตรงนี้ได้)
        
        const createdTask = await taskRepository.create(newTask);
        return createdTask.toJSON();
    }

    async updateTask(id, updates) {
        const existingTask = await taskRepository.findById(id);
        if (!existingTask) throw new Error('Task not found');
        const updatedTask = await taskRepository.update(id, updates);
        return updatedTask.toJSON();
    }

    async deleteTask(id) {
        const existingTask = await taskRepository.findById(id);
        if (!existingTask) throw new Error('Task not found');
        return await taskRepository.delete(id);
    }
    
    // (ฟังก์ชันอื่นๆ ที่เหลือ)
    async moveToNextStatus(id) {
        const task = await taskRepository.findById(id);
        if (!task) throw new Error('Task not found');
        let next = 'TODO';
        if (task.status === 'TODO') next = 'IN_PROGRESS';
        else if (task.status === 'IN_PROGRESS') next = 'DONE';
        return (await taskRepository.update(id, { status: next })).toJSON();
    }
    
    async getStatistics() { return await taskRepository.countByStatus(); }
}

module.exports = new TaskService();
