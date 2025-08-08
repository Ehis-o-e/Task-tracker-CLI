import { argv } from 'process';
import fs from 'fs';
function loadJSONFile(fileName) {
    if (!fs.existsSync(fileName)) {
        console.log('you dont have a file');
        return [];
    }
    try {
        const content = fs.readFileSync(fileName, 'utf-8');
        return JSON.parse(content);
    }
    catch {
        return [];
    }
}
function saveJSONfile(fileName, tasks) {
    const newData = JSON.stringify(tasks);
    fs.writeFileSync(fileName, newData, 'utf-8');
}
function generateUniqueId(tasks) {
    if (tasks.length === 0) {
        return 1; // Start with ID 1 if no tasks exist
    }
    // Get the highest existing ID and add 1
    const maxId = Math.max(...tasks.map(task => task.id));
    return maxId + 1;
}
function main() {
    const command = argv[2];
    const task = argv[3];
    const tasks = loadJSONFile('tasks.json');
    if (tasks.length === 0 && command !== 'add') {
        console.log("There is no task to do currently");
    }
    switch (command) {
        case 'add':
            if (!task) {
                console.log("Please provide a task");
                process.exit(1);
            }
            const newTask = {
                id: generateUniqueId(tasks),
                task: task,
                status: "pending",
                date: new Date(),
            };
            tasks.push(newTask);
            console.log(`Added task: ${task}`);
            break;
        case 'list':
            tasks.forEach(t => console.log(`${t.id} ${t.task} ${t.status} ${t.date}`));
            break;
        case 'delete':
            if (!task) {
                console.log("Provide an ID");
                process.exit(1);
            }
            const taskId = parseInt(task);
            const taskIndex = tasks.findIndex(t => t.id === taskId);
            if (taskIndex === -1) {
                console.log(`The ID ${taskId} is not found`);
            }
            else {
                tasks.splice(taskIndex, 1);
                console.log(`The task with ${taskId} has been removed`);
            }
            break;
        case 'complete':
            if (!task) {
                console.log("Provide an ID");
                process.exit(1);
            }
            const completeId = parseInt(task);
            const completeIndex = tasks.findIndex(t => t.id === completeId);
            if (completeIndex === -1) {
                console.log(`The ID ${completeId} is not found`);
            }
            else {
                tasks[completeIndex].status = "completed";
                console.log(`Task ${completeId} has been completed`);
            }
            break;
        default:
            console.log('invalid command, try again');
    }
    saveJSONfile("tasks.json", tasks);
}
main();
//# sourceMappingURL=taskTrackerCli.js.map