
// ---- State + DOM refs ----
let allTasks = [];
let currentSearch = '';

const addTaskForm = document.getElementById('addTaskForm');
const titleInput = document.getElementById('taskTitle');
const descInput = document.getElementById('taskDescription');
const prioritySelect = document.getElementById('taskPriority');
const statusFilter = document.getElementById('statusFilter');
const linkInput = document.getElementById('taskLink');
const assigneesInput = document.getElementById('taskAssignees');

const todoTasks = document.getElementById('todoTasks');
const progressTasks = document.getElementById('progressTasks');
const doneTasks = document.getElementById('doneTasks');

const todoCount = document.getElementById('todoCount');
const progressCount = document.getElementById('progressCount');
const doneCount = document.getElementById('doneCount');

// ---- Utilities ----
function escapeHtml(str) {
    if (!str) return '';
    return str.replace(/[&<>"']/g, function (c) {
        return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c];
    });
}

function formatDate(iso) {
    if (!iso) return '';
    const d = new Date(iso);
    return d.toLocaleString('th-TH');
}

function showLoading() {
    const el = document.getElementById('loadingOverlay');
    if (el) el.style.display = 'flex';
}
function hideLoading() {
    const el = document.getElementById('loadingOverlay');
    if (el) el.style.display = 'none';
}

function showToast(message) {
    // สร้าง Toast ง่ายๆ
    const t = document.createElement('div');
    t.textContent = message;
    t.style.cssText = "position:fixed; bottom:20px; right:20px; background:#333; color:#fff; padding:10px 20px; border-radius:5px; z-index:9999;";
    document.body.appendChild(t);
    setTimeout(() => t.remove(), 3000);
}

// ---- API ----
async function fetchTasks() {
    try {
        showLoading();
        // เรียก API (Relative Path)
        const res = await fetch('/api/tasks');
        const json = await res.json();
        
        // 🔥 จุดแก้สำคัญ: ต้องดึงข้อมูลจาก json.data
        if (json.success && Array.isArray(json.data)) {
            allTasks = json.data; 
        } else {
            allTasks = [];
            console.warn('รูปแบบข้อมูลไม่ถูกต้อง:', json);
        }
        
        renderTasks();
    } catch (err) {
        console.error(err);
        showToast('❌ ไม่สามารถโหลดข้อมูลได้');
    } finally {
        hideLoading();
    }
}

async function createTaskAPI(taskData) {
    const res = await fetch('/api/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(taskData)
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.error || 'Failed to create task');
    return json;
}

async function updateTaskStatusAPI(id, status) {
    const res = await fetch(`/api/tasks/${id}`, { // แก้ endpoint ให้ตรงกับ Controller (PUT)
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
    });
    if (!res.ok) throw new Error('Failed to update status');
    return res.json();
}

async function deleteTaskAPI(id) {
    const res = await fetch(`/api/tasks/${id}`, { method: 'DELETE' });
    if (!res.ok) throw new Error('Failed to delete task');
    return res.json();
}

// ---- Rendering ----
function clearChildren(el) {
    while (el.firstChild) el.removeChild(el.firstChild);
}

function renderTasks() {
    const filter = statusFilter ? statusFilter.value : 'ALL';

    clearChildren(todoTasks);
    clearChildren(progressTasks);
    clearChildren(doneTasks);

    const searchTerm = currentSearch ? currentSearch.trim().toLowerCase() : '';
    const filtered = allTasks.filter(t => {
        const statusMatch = filter === 'ALL' ? true : t.status === filter;
        if (!statusMatch) return false;
        if (!searchTerm) return true;
        const inTitle = t.title && t.title.toLowerCase().includes(searchTerm);
        return inTitle;
    });

    const todo = filtered.filter(t => t.status === 'TODO');
    const inprog = filtered.filter(t => t.status === 'IN_PROGRESS');
    const done = filtered.filter(t => t.status === 'DONE');

    todo.forEach(t => todoTasks.appendChild(createTaskCard(t)));
    inprog.forEach(t => progressTasks.appendChild(createTaskCard(t)));
    done.forEach(t => doneTasks.appendChild(createTaskCard(t)));

    if(todoCount) todoCount.textContent = todo.length;
    if(progressCount) progressCount.textContent = inprog.length;
    if(doneCount) doneCount.textContent = done.length;
}

function createTaskCard(task) {
    const card = document.createElement('div');
    card.className = 'task-card';
    card.draggable = true;
    card.dataset.taskId = task.id;

    card.innerHTML = `
        <div class="task-header">
            <div class="task-title">${escapeHtml(task.title)}</div>
            <span class="priority-badge priority-${(task.priority||'MEDIUM').toLowerCase()}">${escapeHtml(task.priority||'MEDIUM')}</span>
        </div>
        <div class="task-description">${escapeHtml(task.description || '')}</div>
        <div class="task-meta">สร้างเมื่อ: ${formatDate(task.created_at)}</div>
        <div class="task-actions">
            ${task.status === 'TODO' ? `<button class="btn btn-sm btn-secondary" onclick="moveTask(${task.id}, 'IN_PROGRESS')">เริ่มทำ</button>` : ''}
            ${task.status === 'IN_PROGRESS' ? `<button class="btn btn-sm btn-success" onclick="moveTask(${task.id}, 'DONE')">เสร็จ</button>` : ''}
            <button class="btn btn-sm btn-danger" onclick="removeTask(${task.id})">ลบ</button>
        </div>
    `;

    return card;
}

// ---- Global Helpers ----
window.moveTask = async function(id, status) {
    try {
        showLoading();
        await updateTaskStatusAPI(id, status);
        await fetchTasks();
    } catch (err) {
        console.error(err);
        showToast('❌ ย้ายงานไม่สำเร็จ');
    } finally {
        hideLoading();
    }
};

window.removeTask = async function(id) {
    if (!confirm('ลบงานนี้?')) return;
    try {
        showLoading();
        await deleteTaskAPI(id);
        await fetchTasks();
        showToast('🗑️ ลบงานแล้ว');
    } catch (err) {
        console.error(err);
        showToast('❌ ลบงานไม่สำเร็จ');
    } finally {
        hideLoading();
    }
};

// Init
document.addEventListener('DOMContentLoaded', () => {
    fetchTasks(); // โหลดข้อมูลเมื่อเปิดหน้าเว็บ

    if (addTaskForm) {
        addTaskForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const title = titleInput.value.trim();
            if (!title) return alert('กรุณาใส่งาน');

            const payload = {
                title,
                description: descInput ? descInput.value.trim() : '',
                priority: prioritySelect ? prioritySelect.value : 'MEDIUM',
                status: 'TODO'
            };

            try {
                showLoading();
                await createTaskAPI(payload);
                addTaskForm.reset();
                await fetchTasks();
                showToast('✅ สร้างงานสำเร็จ');
            } catch (err) {
                console.error(err);
                showToast('❌ สร้างงานไม่สำเร็จ: ' + err.message);
            } finally {
                hideLoading();
            }
        });
    }
});