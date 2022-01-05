


import {_ToDo } from "./toDo";


export class dbListEntries {
    public entries: string[] = [];
    constructor(entries: string[]) {
        this.entries = entries;
    }
}



export class dbEntry {
    public message: string;
    public type: dbEntryType;
   

    constructor(message:string, type: dbEntryType, public decrypt: string) {
        this.message = message;
        this.type = type;
    }
   
}

export enum dbEntryType {todo=0, list=1}

