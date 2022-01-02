import { ToDo } from "../toDo/toDo";

export class User {

    public toDos: ToDo[];
    private secret: string;

    constructor(
        public username: string,
        secret?: string,
        toDos?: ToDo[]
    ) {
        if (toDos === undefined) {
            this.toDos = [];
        } else {
            this.toDos = toDos;
        }
        if (secret === undefined) {
            this.secret = undefined;
        } else {
            this.secret = secret;
        }
    }

    public addToDo(toDo: ToDo) {
        this.toDos.push(toDo);
    }

    public updateToDo(updatedToDo: ToDo) {
        let index = this.toDos.findIndex(item => item.getToken() == updatedToDo.getToken());
        if (index === undefined) return false;
        this.toDos[index] = updatedToDo;
        return true;
    }

    public removeToDo(removeToDo: ToDo) {
        this.toDos.splice(this.toDos.findIndex(item => item.getToken() === removeToDo.getToken()),1);
    }


}