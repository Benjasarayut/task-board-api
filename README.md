# 📋 Task Board API

Backend Service สำหรับระบบจัดการงาน (Task Management) พัฒนาด้วย Node.js และ Express เชื่อมต่อกับฐานข้อมูล SQLite โดยใช้โครงสร้างแบบ Layered Architecture

## 🚀 คุณสมบัติ (Features)
- **RESTful API:** รองรับ CRUD Operations (Create, Read, Update, Delete) ครบถ้วน
- **Layered Architecture:** แยกส่วนการทำงานชัดเจน (Controller → Service → Repository)
- **SQLite Database:** ฐานข้อมูลในตัว น้ำหนักเบา ไม่ต้องติดตั้ง server เพิ่ม
- **Auto-Restart:** รองรับการรันผ่าน PM2 เพื่อให้ทำงานตลอดเวลา

## 🛠️ เทคโนโลยีที่ใช้ (Tech Stack)
- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** SQLite3
- **Process Manager:** PM2

## 📦 วิธีการติดตั้งและใช้งาน (Installation)

1. **Clone โปรเจกต์**
   ```bash
   git clone [https://github.com/Benjasarayut/task-board-api.git](https://github.com/Benjasarayut/task-board-api.git)
   cd task-board-api

```
npm install
```

# รันด้วย Node ปกติ
```
node server.js
```
# หรือรันด้วย PM2 (แนะนำสำหรับ Production)
```
pm2 start server.js --name task-board-api
```
```
Method,Endpoint,คำอธิบาย
GET,/api/tasks,ดูรายการงานทั้งหมด
POST,/api/tasks,สร้างงานใหม่
GET,/api/tasks/:id,ดูรายละเอียดงานตาม ID
PUT,/api/tasks/:id,อัปเดตข้อมูล/สถานะงาน
DELETE,/api/tasks/:id,ลบงาน
```
