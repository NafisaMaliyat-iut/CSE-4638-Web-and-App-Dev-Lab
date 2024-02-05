"use strict";
class TaskManager {
  constructor(tasksInfo, id, callback) {
    this.id = id;
    this.callback = callback;
    this.tasks = tasksInfo;
  }

  render(date) {
    //get the week dates
    const weekStart = new Date(date);
    weekStart.setDate(
      date.getDate()
    );

    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekStart.getDate() + 6);

    //set the date range in html
    const options = { day: '2-digit', month: '2-digit', year: 'numeric' };
    document.getElementById('currentWeek').textContent = `${weekStart.toLocaleDateString('en-GB', options)} - ${weekEnd.toLocaleDateString('en-GB', options)}`;

    //filter current week's tasks 
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

    //set rows for each day
    for (let i = 0; i < 7; i++) {
      const currentDay = new Date(weekStart);
      currentDay.setDate(weekStart.getDate() + i);
      const dayName = currentDay.toLocaleDateString("en-US", { weekday: "short" });
      tasksByDay.set(dayName, []);
    }

    //push each day's tasks into the week
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

    //set the max columns for max number of tasks per day
    const maxTasks = Math.max(...Array.from(tasksByDay.values()).map(tasks => tasks.length));

    Array.from(tasksByDay).forEach(
      //iterate for each day
      ([dayName, tasksForDay]) => {
        const row = document.createElement("tr"); //create a row for each day
        const dayCell =
          document.createElement("td");
        dayCell.textContent = dayName; //create column for day name
        row.appendChild(dayCell);
        for (let j = 0; j < maxTasks; j++) {//create columns with column number equal to maxTasks
          const cell =
            document.createElement("td"); //create columns for each task
          if (
            tasksForDay &&
            j < tasksForDay.length
            ) {
              //add task name to each column
              cell.innerHTML = `${tasksForDay[j].name}`;
              cell.addEventListener('click', () => { //callback function called to display task details
                if (this.callback) {
                  this.callback(tasksForDay[j]);
                }
              });
          }
          row.appendChild(cell); //add the column to the row
        }

        table.appendChild(row); //add the row to the column
      }
    );
  }
}
