"use strict";
class TaskManager {
  constructor(tasksInfo, id, callback) {
    this.id = id;
    this.callback = callback;
    this.tasks = tasksInfo;
  }

  render(date) {
    const weekStart = new Date(date);
    weekStart.setDate(
      date.getDate() - date.getDay()
    );

    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekStart.getDate() + 6);

    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    document.getElementById('currentWeek').textContent = `${weekStart.toLocaleDateString('en-US', options)} - ${weekEnd.toLocaleDateString('en-US', options)}`;

    const weekTasks = this.tasks.filter(
      (task) =>
        task.dueDate >= weekStart &&
        task.dueDate <= weekEnd
    );

    const taskManagerDiv =
      document.getElementById(this.id);

    taskManagerDiv.innerHTML =
      "<table id='task-table'></table>";

    const table =
      document.getElementById("task-table");

    const tasksByDay = new Map();

    for (let i = 0; i < 7; i++) {
      const currentDay = new Date(weekStart);
      currentDay.setDate(weekStart.getDate() + i);
      const dayName = currentDay.toLocaleDateString("en-US", { weekday: "short" });
      tasksByDay.set(dayName, []);
    }

    weekTasks.forEach((task) => {
      const day = task.dueDate.toLocaleDateString(
        "en-US",
        { weekday: "short" }
      );
      if (!tasksByDay.has(day)) {
        tasksByDay.set(day, []);
      }
      tasksByDay.get(day).push(task);
    });

    const maxTasks = Math.max(...Array.from(tasksByDay.values()).map(tasks => tasks.length));

    Array.from(tasksByDay).forEach(
      ([dayName, tasksForDay]) => {
        const row = document.createElement("tr");
        const dayCell =
          document.createElement("td");
        dayCell.textContent = dayName;
        row.appendChild(dayCell);
        for (let j = 0; j < maxTasks; j++) {
          const cell =
            document.createElement("td");

          if (
            tasksForDay &&
            j < tasksForDay.length
            ) {
              cell.innerHTML = `${tasksForDay[j].name}`;
              // cell.innerHTML = `${tasksForDay[j].name}<br>Priority: ${tasksForDay[j].priority}`;
              cell.classList.add(`priority-${tasksForDay[j].priority}`);
              cell.addEventListener('click', () => {
                if (this.callback) {
                  this.callback(tasksForDay[j]);
                }
              });
          }
          row.appendChild(cell);
        }

        if (!weekTasks || weekTasks.length === 0) {
          const emptyCell = document.createElement("td");          
          row.appendChild(emptyCell);
        }

        table.appendChild(row);
      }
    );
  }
}
