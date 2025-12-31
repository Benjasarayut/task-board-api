const taskService = require('../services/taskService');

class TaskController {
    async getAllTasks(req, res, next) {
        try {
            const filters = {};
            if (req.query.status) filters.status = req.query.status.toUpperCase();
            if (req.query.priority) filters.priority = req.query.priority.toUpperCase();
            const tasks = await taskService.getAllTasks(filters);
            res.json({ success: true, data: tasks });
        } catch (error) {
            next(error);
        }
    }

    async getTaskById(req, res, next) {
        try {
            const id = parseInt(req.params.id);
            const task = await taskService.getTaskById(id);
            res.json({ success: true, data: task });
        } catch (error) {
            next(error);
        }
    }

    // 🔥 จุดแก้: เพิ่ม Log เพื่อดูว่าข้อมูลมาถึงไหม
    async createTask(req, res, next) {
        try {
            console.log('📦 ข้อมูลที่ส่งมา (req.body):', req.body); // ดูว่าหน้าเว็บส่งอะไรมา

            const taskData = {
                title: req.body.title,
                description: req.body.description,
                status: req.body.status || 'TODO',
                priority: req.body.priority || 'MEDIUM'
            };

            const task = await taskService.createTask(taskData);
            console.log('✅ สร้างสำเร็จ:', task); // ดูว่า Database ตอบอะไรกลับมา

            res.status(201).json({ success: true, data: task });
        } catch (error) {
            console.error('❌ Error ตอนสร้าง:', error.message); // ดูว่าพังเพราะอะไร
            next(error);
        }
    }

    async updateTask(req, res, next) {
        try {
            const id = parseInt(req.params.id);
            const updates = { ...req.body };
            const task = await taskService.updateTask(id, updates);
            res.json({ success: true, data: task });
        } catch (error) {
            next(error);
        }
    }

    async deleteTask(req, res, next) {
        try {
            const id = parseInt(req.params.id);
            await taskService.deleteTask(id);
            res.json({ success: true, message: 'Deleted' });
        } catch (error) {
            next(error);
        }
    }
}

module.exports = new TaskController();
