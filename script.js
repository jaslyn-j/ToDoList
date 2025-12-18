let tasks=[]
let editingId=null

function loadData(){

    const saved=localStorage.getItem('flowTasks')
    if(saved) tasks=JSON.parse(saved)
    else
        tasks=[
            {
                id:1,
                title: "Sample Task 1",
                status: "Not Started",
                completed: false,
            },
        ];
    renderTasks();
}

function saveData(){
    localStorage.setItem('flowTasks', JSON.stringify(tasks));
}

function renderTasks(){
    const onHold=tasks.filter((t) => !t.completed)
    const completed=tasks.filter((t) => t.completed)

    document.getElementById("onHoldTasks").innerHTML=onHold.length ? onHold.map((t)=>
        `
        <div class="task-item">
            <div class="task-checkbox" ${t.completed ? "completed" : ""} onclick="toggleTask(${t.id})"></div>
            <div class="task-content">
                <div class="task-title ${t.completed ? "completed" : ""}">${t.title}</div>
            </div>
            <span class="status-badge status-${t.status}">
                ${
                    t.status==="progress" ? "In Progress" : t.status.charAt(0).toUpperCase() + t.status.slice(1)
                }
            </span>

            <button class="icon-btn" style="width: 30px; height: 30px; border: none; border-radius: 12px;" onclick="editTask(${t.id})">
                <i class="fa-solid fa-pen" style="font-size: 12px;"></i>
            </button>

            <button class="icon-btn" style="width: 30px; height: 30px; border: none; border-radius: 12px;" onclick="deleteTask(${t.id})">
                <i class="fa-solid fa-trash" style="font-size: 12px;"></i>
            </button>
        </div>
        `
        ).join("")
        : '<p style="color: #9ca3af; padding: 20px;">No task on hold</p>'

        document.getElementById("completedTasks").innerHTML=completed.length ? completed.map((t)=>
        `
         <div class="task-item">
            <div class="task-checkbox completed" onclick="toggleTask(${t.id})"></div>
            <div class="task-content">
                <div class="task-title completed">${t.title}</div>
            </div>
            <span class="status-badge status-completed">Completed</span>

            <button class="icon-btn" style="width: 30px; height: 30px; border: none; border-radius: 12px;" onclick="editTask(${t.id})">
                <i class="fa-solid fa-pen" style="font-size: 12px;"></i>
            </button>

            <button class="icon-btn" style="width: 30px; height: 30px; border: none; border-radius: 12px;" onclick="deleteTask(${t.id})">
                <i class="fa-solid fa-trash" style="font-size: 12px;"></i>
            </button>
        </div>   
        
        `
        ).join("")
        : '<p style="color: #9ca3af; padding: 20px;">No task on hold</p>'

    const total=tasks.length;
    const completedCount=tasks.filter((t)=> t.completed).length;
    const pending=total-completedCount;
    const rate=total?Math.round((completedCount/total)*100):0;
    document.getElementById("taskCount").textContent=pending;
    document.getElementById("totalTasks").textContent=total;
    document.getElementById("completedCount").textContent=completedCount;
    document.getElementById("pendingCount").textContent=pending;
    document.getElementById("completedRateValue").textContent=rate+"%";
    document.getElementById("totalProgress").style.width=rate+"%";
    document.getElementById("completionProgress").style.width=rate+"%";
    saveData();
}

function toggleTask(id){
    const t=tasks.find((t) => t.id===id);
    if (t){
        t.completed= !t.completed;
        t.status=t.completed ?"completed":"pending";
        renderTasks();
    }
}

function deleteTask(id){
    if (confirm("Are you sure you want to delete this task?")){
        tasks=tasks.filter((t) =>t.id !== id);
        renderTasks();
    }
}
function openModal(){
    document.getElementById("taskModal").classList.add("active");
}
function closeModal(){
    document.getElementById("taskModal").classList.remove("active");
    document.getElementById("taskForm").reset();
    editingId = null;
}

document.getElementById("taskForm").addEventListener("submit", (e) =>{
        e.preventDefault();
        const title=document.getElementById("taskTitle").value;
        const status=document.getElementById("taskStatus").value;
        if (editingId){
          const t=tasks.find((t)=>t.id===editingId);
          t.title=title;
          t.status=status;
          t.completed=status === "completed";
        }else{
          tasks.push({id: Date.now(),title,status,
            completed: status === "completed",});
        }
        renderTasks();
        closeModal();
      });
      
function editTask(id) {
    editingId = id;
    const t = tasks.find((t) => t.id === id);
    if (t) {
        document.getElementById("taskTitle").value = t.title;
        document.getElementById("taskStatus").value = t.status;
        openModal();
    }
}
loadData();


