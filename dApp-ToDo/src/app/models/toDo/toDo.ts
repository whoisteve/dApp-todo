import { Task } from "./task";
import {sha256} from 'crypto-hash';

export class ToDo {

    public tasks: Task[];
    public title: string;



    constructor(
        title: string, 
        tasks?: Task[]
    ) {
        this.title = title;
        if (tasks === undefined) {
            this.tasks = []
        } else {
            this.tasks = tasks;
        }
    }

    /// add Task to ToDo
    public addTask(newTask: Task):boolean {
        if (this.tasks.includes(newTask)) return false;
        this.tasks.push(newTask);
        return true;

    }

    public updateTask(updatedTask: Task): boolean {
        let index = this.tasks.findIndex(item => item.key == updatedTask.key);
        if (index === undefined) return false;
        this.tasks[index] = updatedTask;
        return true;
    }
    
    /// remove Task from ToDo
    public removeTask(removeTask: Task): boolean{
        let index = this.tasks.findIndex(item => item.key === removeTask.key);
        console.log(index);
        if (index === undefined) return false;
        this.tasks.splice(index,1);
        return true;
    }

 

    /// add all Parameters to String and return encoded Token of  Obj
    public getToken(): string {
        //backup return since following is async
        return this.title;

        // Function to hash object cannot be async !        
        let enc = new TextEncoder();
        var toBeCrypt: string = "";
        toBeCrypt += this.title;
        if (this.tasks === undefined || this.tasks.length == 0) 
             sha256(toBeCrypt).then(x => {
                return x;
            });
        for (var task of this.tasks) {
            toBeCrypt += task.input;
            toBeCrypt += task.state;
            if (this.tasks.indexOf(task) == this.tasks.length) 
                sha256(toBeCrypt).then(x => {
                    return x;
                });
        }
    }

    public routeToDo(toDo: ToDo) {

    }

}