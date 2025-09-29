import express from 'express';
import fs from 'fs';
import { argv } from 'process';


const app = express();
const port = 3000;


type Task = {
    id: number;
    description: string;
    status: 'to-do' | 'in-progress' | 'done';
    createdAt: Date;
    updatedAt: Date;
}

function loadJsonFile(fileName: string): Task[] {
    if (!fs.existsSync(fileName)) {
        console.log('you do not have this file');
        return []
    }

    try{
        const content = fs.readFileSync(fileName, 'utf-8')
        return JSON.parse(content) as Task[]
    }
    catch{
        return []
    }
}

function saveJsonFile(fileName:string, tasks:Task[]){
    const newData = JSON.stringify(tasks)
    fs.writeFileSync(fileName, newData, 'utf-8')
}

function generateId(tasks:Task[]){
    if (tasks.length === 0){
        return 1
    }

    const maxId = Math.max(...tasks.map(task => task.id))
    return maxId + 1
}


function main(){
    const command = argv[2];
    const task = argv[3];
    const correction = argv[4]
    const tasks = loadJsonFile('tasks.json');

    if(tasks.length === 0 && command !=='add'){
        console.log('there is no task currently')
    }

    switch(command){
        case 'add':
              if (!task){
                console.log("Please provide a task");
                process.exit(1);
            }
            const newTask: Task = {
                id: generateId(tasks),
                description: task,
                status: 'to-do',
                createdAt: new Date(),  
                updatedAt: new Date()
            };
            tasks.push(newTask);
            console.log(`Task added successfully: ID:${newTask.id}`);
        break;
        
        case 'update':
                if (!task || !correction){
                    console.log('Please provide the ID and update')
                    process.exit(1)
                }
                const taskId = parseInt(task!)
                const taskIndex = tasks.findIndex(t => t.id === taskId);
                if(taskIndex === -1){
                    console.log('Task not found, try again')
                }else{
                    tasks[taskIndex]!.description = correction
                    tasks[taskIndex]!.updatedAt = new Date()
                    console.log('Task has been updated')
                }
                
            break;

        case 'list':
            switch(task){
            case undefined:
            case '':
            tasks.forEach(t => {
                console.log(`${t.id} ${t.description} ${t.status} ${t.createdAt} ${t.updatedAt}`)
            })
            break;

            case 'done':
                const done = tasks.filter(t => t.status === 'done')
                done.forEach(t => {
                    console.log(`${t.id} ${t.description} ${t.status} ${t.createdAt} ${t.updatedAt}`);
                });
            break;

            case 'to-do':
                const todo = tasks.filter(t => t.status === 'to-do')
                todo.forEach(t => {
                    console.log(`${t.id} ${t.description} ${t.status} ${t.createdAt} ${t.updatedAt}`);
                });
            break;

            case 'in-progress':
                const inprogress= tasks.filter(t => t.status === 'in-progress')
                inprogress.forEach(t => {
                    console.log(`${t.id} ${t.description} ${t.status} ${t.createdAt} ${t.updatedAt}`);
                });
            break;

            default:
                console.log('Invalid input: Input done, to-do or in-progress')
            }
            
        break;
        
        case 'mark-done':
            if (!task){
                console.log('Please provide an ID')
                process.exit(1)
            }

            const completeId = parseInt(task);
            const completeIndex = tasks.findIndex(t=> t.id === completeId)
            if(completeIndex === -1){
                console.log('Task not found try again');
            }else {
                tasks[completeIndex]!.status = 'done'
            }
            console.log(`selected task is completed`)
        break;

        case 'mark-in-progress':
            if (!task){
                console.log('Please provide an ID')
                process.exit(1)
            }

            const progressId = parseInt(task);
            const progressIndex = tasks.findIndex(t=> t.id === progressId)
            if(progressIndex === -1){
                console.log('Task not found try again');
            }else {
                tasks[progressIndex]!.status = 'done'
            }
            console.log(`selected task is completed`)
        break;


        case 'delete':
           if (!task){
                console.log('Please provide an ID')
                process.exit(1)
            }

            const deleteId = parseInt(task);
            const deleteIndex = tasks.findIndex(t => t.id === deleteId)
            if(deleteIndex === -1){
                console.log('Task does not exist')
            }else{
                tasks.splice(deleteIndex, 1);
                console.log('Task has been deleted')
            }
        break;
        default:
            console.log('invalid command, try again')
}
    saveJsonFile('tasks.json', tasks)
}

main()
