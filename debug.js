const taskService = require('./src/services/taskService');
const db = require('./database/connection');

async function test() {
    console.log('🔍 เริ่มการทดสอบ Database...');
    try {
        // 1. ลองสร้าง Task
        console.log('1. กำลังทดลองสร้าง Task...');
        const newTask = await taskService.createTask({
            title: "Test Task from Debug",
            description: "This is a test",
            status: "TODO",
            priority: "HIGH"
        });
        console.log('✅ สร้างสำเร็จ! ได้ข้อมูลกลับมา:', newTask);

        // 2. ลองดึงข้อมูล
        console.log('2. กำลังดึงข้อมูลทั้งหมด...');
        const tasks = await taskService.getAllTasks({});
        console.log('✅ ดึงสำเร็จ! จำนวนงานทั้งหมด:', tasks.length);

    } catch (err) {
        console.error('❌ พังตรงนี้ครับ:', err);
    }
}

// รอ 1 วินาทีให้ DB Connect ก่อนแล้วค่อยรัน
setTimeout(test, 1000);

