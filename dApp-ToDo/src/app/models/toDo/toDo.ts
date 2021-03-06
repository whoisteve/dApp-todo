import { Task, _Task } from "./task";
import {sha256} from 'crypto-hash';

export class _ToDo {
    public key: string;
    public tasks: _Task[];
    constructor(public title: string){
        this.tasks = [];
    }

    init(){
        this.key = Math.random().
        toString(36).substring(2, 15) + 
        Math.random().toString(36).substring(2, 15);
    }

    updatePKey(key: string) {
        this.tasks.forEach(item => item.parentKey = key);
    }
}
export class ToDo {

    public tasks: Task[] = [];
    public title: string;
    public key: string;
    public pub: boolean;



    constructor(
        title: string, key:string, tasks?: _Task[]
    ) {
        this.title = title;
        if (key == undefined) {

        } else {
            this.key = key;
        }
        if (tasks == [] || tasks == undefined) {
            this.tasks = [];
        } else {
            for (var task of tasks) {
                this.tasks.push(new Task(task.input, task.state, this.key, task.key))
                
            }
        }
    }


    /// add Task to ToDo
    public addTask(newTask: Task):boolean {
        if (this.tasks.includes(newTask)) return false;
        this.tasks.push(newTask);
        newTask.parentKey = this.key;
        return true;

    }

    public updateTask(updatedTask: Task): boolean {
        
        console.log("HEllo");
        console.log(updatedTask);
        console.log(this.tasks);

        let index = this.tasks.findIndex(item => item.key == updatedTask.key);
        if (index === undefined) return false;
        this.tasks[index] = updatedTask;
        return true;
    }
    
    /// remove Task from ToDo
    public removeTask(removeTask: Task): boolean{
        removeTask.parentKey = this.key;
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