import { Injectable, ResolvedReflectiveFactory } from '@angular/core';
// RxJs
import { BehaviorSubject, Observable } from 'rxjs';
import { ToDo, _ToDo } from '../models/toDo/toDo';
// Gun
import * as Gun from 'gun/gun';
require('gun/sea');
require('gun/lib/unset.js');

import { User } from '../models/user/user';
import { Task, taskState } from '../models/toDo/task';
import { GunDb } from './gunDb.service';
import { on$ } from './gun.helper';
import { resolve } from 'dns';
import { dbEntry, dbEntryType, dbListEntries } from '../models/toDo/map';


export enum loginMessage{unknownUser="Der Nutzer ist nicht bekannt", 
  wrongPassword="Username oder Password stimmen nicht", 
  userSameName="Username schon vorhanden", 
  success="", 
  timeout="Zeitüberschreitung der Anfrage", 
  shortPassword="Password zu kurz"}

export interface loginInterface {err: string}

const graphDBKey = "keyToDo";
const graphDBKeyList = "UserList/"

@Injectable({
  providedIn: 'root'
})

export class GunService {
  public subUser: BehaviorSubject<User> = new BehaviorSubject(new User(""));
  public removed: BehaviorSubject<boolean> = new BehaviorSubject(false);
  public toDoUpdated: BehaviorSubject<boolean> = new BehaviorSubject(false);
  public user = this.db.gun.user().recall({sessionStorage: true});

  constructor(private db: GunDb) { }


/***                      ***/
/* Authentification Service */
/***                      ***/
  async signUpUser(username: string, password: string): Promise<loginMessage> {
    return new Promise<loginMessage>((resolve) => {
      this.user.create(username, password, function (ack) {
        if (ack.hasOwnProperty("err")) {
           let interace = ack as loginInterface;
           if (interace.err == "User already created!" ) {
             resolve(loginMessage.userSameName)
           } else if (interace.err == "Password too short!") {
             resolve(loginMessage.shortPassword)
           }
        } else if (ack.hasOwnProperty("ok") || ack.hasOwnProperty("put")){
          resolve(loginMessage.success);
        }    
      })
      setTimeout( function() { resolve(loginMessage.timeout) }, 500);
    })
  }

  async loginUser(username: string,password: string): Promise <loginMessage> {
     return new Promise<loginMessage>((resolve) => {
      this.user.auth(username, password, function(ack) {
        if (ack.hasOwnProperty("err")) {
           let interace = ack as loginInterface;
           if (interace.err == "Wrong user or password." ) {
             resolve(loginMessage.wrongPassword)
           }
        } else if (ack.hasOwnProperty("ok") || ack.hasOwnProperty("put")){
          resolve(loginMessage.success);
        }    
      })
      setTimeout( function() { resolve(loginMessage.timeout) }, 5000);
    })
  }
  // Logout User via Authentification
  logoutUser(): Promise <boolean> {
    return new Promise<boolean>((resolve) => {
      this.subUser = new BehaviorSubject(new User(""));
      this.user.leave();
      this.user = this.db.gun.user().recall({sessionStorage: true});
      resolve(true);
    });
  }
  // Check if User is currently logged in
  isLoggedIn(): Promise <boolean>  {
    return new Promise<boolean>((resolve) => {
      if (this.subUser.value.username!=""){
        resolve(true);
      }
      else {
        resolve(false);
      }0
    })
  }

/***                      ***/
/*    ToDo Data Handling    */
/***                      ***/

/// Add ToDo to Graph DB
/// Parameter: none
async addToDo(updateToDo?: ToDo): Promise<ToDo> {
  return new Promise<ToDo>(async (resolve) => {

    // Build new Dummy ToDo
    let toDo:_ToDo
    if (updateToDo == undefined) {
    toDo = new _ToDo("Neuer ToDo");
    toDo.init()
    } else {
      toDo = new _ToDo(updateToDo.title);
      toDo.key = updateToDo.key;
      toDo.tasks = updateToDo.tasks;
      toDo.key = updateToDo.key;
      toDo.updatePKey(updateToDo.key);
    }
    // Get Encryption-Key
    let pair = this.user.pair().priv;
    // Encrypt toDo
    let message= await Gun.SEA.encrypt(toDo, pair);
    let element = new dbEntry(message, dbEntryType.todo, "");
    // Save element in DB
    this.db.gun.get(graphDBKey).get(toDo.key).put(element);
    // Get Entry from DB

    this.updateToDoList(toDo).then(async list => {
       let message= await Gun.SEA.encrypt(list, this.user.pair().pub);
       let element = new dbEntry(message, dbEntryType.list, "");
       this.db.gun.get(graphDBKey).get(graphDBKeyList).get(this.user.pair().pub).put(element);
      return;
    })
 
    this.db.gun.get(graphDBKey).get(toDo.key, async function(ack) {
        // Get Output of DB-Entry
        let message = ack.put as dbEntry;
        // Decrypt Message to _ToDo Object
        let decryptToDo= await Gun.SEA.decrypt(message.message, pair);
        let object = decryptToDo as _ToDo;
        // Save element in Personal ToDos
        let toDoObject = new ToDo(object.title,object.key, object.tasks);
        toDoObject.key = toDo.key;
        resolve(toDoObject);
      })
    })
}

/// Update user ToDo List
/// Parameter: * toDo as _ToDo  
  async updateToDoList(toDo: _ToDo): Promise <dbListEntries> {
    return new Promise<dbListEntries>((resolve) => {
      // Get user List
      let pair = this.user.pair().pub;
      let list: dbListEntries;
      var written = false;
      this.db.gun.get(graphDBKey).get(graphDBKeyList).get(pair , async function(ack){
        if (ack.put == undefined && !written) {
          list = new dbListEntries([(toDo.key)]);
          resolve(list);
          written = true
          return;
        } else if (!written){
          let message = ack.put as dbEntry;
          // Decrypt Message to Object
          await Gun.SEA.decrypt(message.message, pair).then(decryptToDo =>{
            let object = decryptToDo as dbListEntries;
            if (object == undefined) return;
            if (object.entries.includes(toDo.key)) {
              object.entries.findIndex
              resolve(object);
              return;
            } else {
              object.entries.push(toDo.key)
              resolve(object);
              written=true;
              return;
            }
          } );
        }
      });
    })
  }

  /// Get user ToDo List Keys
  async getUserToDoList(): Promise <dbListEntries> {
    return new Promise<dbListEntries>((resolve) => {
      // Get user List
      let pair = this.user.pair().pub;
      let list: dbListEntries;
      this.db.gun.get(graphDBKey).get(graphDBKeyList).get(pair , async function(ack){
        if (ack.put == undefined) {
          resolve(new dbListEntries([]))
        } else { 
          let message = ack.put as dbEntry;
          // Decrypt Message to Object
          await Gun.SEA.decrypt(message.message, pair).then(decryptToDo =>{
            let object = decryptToDo as dbListEntries;
            resolve(object)
          });
        }
      });
    })
  }

/// Get one User ToDo 
/// Parameter: * key as Identificator of ToDo - Path
  async getToDo(key: string): Promise <ToDo> {
    return new Promise<ToDo>((resolve) => {

      let pair = this.user.pair().priv;
      /// Get ToDo via key
      this.db.gun.get(graphDBKey).get(key, async function(ack) {
        if(!ack.put){
            console.log("No No Found")
          } else {
            console.log("FOUND");
            let message = ack.put as dbEntry;
            if (message.decrypt != "") {
              await Gun.SEA.decrypt(message.message, message.decrypt).then(decryptToDo =>{
                let object = decryptToDo as _ToDo;
                let nToDo = new ToDo(object.title, object.key, object.tasks);
                resolve(nToDo)
              });
            } else {
              await Gun.SEA.decrypt(message.message, pair).then(decryptToDo =>{
                let object = decryptToDo as _ToDo;
                let nToDo = new ToDo(object.title, object.key, object.tasks);
                resolve(nToDo)
              });
            }
          }
      })
    })
  }

/// Get My User ToDos 
  async getMyToDos(): Promise <ToDo[]> {
    return new Promise<ToDo[]>((resolve) => {

      this.getUserToDoList().then(list => {
        let toDos: ToDo[] = [];
        let privPair = this.user.pair().priv;
        for (var entry of list.entries) {
          this.db.gun.get(graphDBKey).get(entry, async function(ack) {
            let dbEntry = ack.put as dbEntry;
        
            if (dbEntry.decrypt.toString() === "") {
              let decryptToDo= await Gun.SEA.decrypt(dbEntry.message, privPair);
              let object = decryptToDo as _ToDo;
              let newToDo = new ToDo(object.title,object.key, object.tasks);
              if (toDos.findIndex(item => item.key == newToDo.key) == -1) {
                toDos.push(newToDo);
              }
       
            } else {
              let decryptToDo= await Gun.SEA.decrypt(dbEntry.message, dbEntry.decrypt);
              let object = decryptToDo as _ToDo;
              let newToDo = new ToDo(object.title,object.key, object.tasks);
              if (toDos.findIndex(item => item.key == newToDo.key) == -1) {
                toDos.push(newToDo);
              }
            }
            if (toDos.length === list.entries.length) {
              resolve(toDos)
              return;
            }
          })
        }    
      })  
    })
  }

/// Get My Username 
  async getUsername(): Promise <string> {
    return new Promise<string>((resolve) => {
      this.db.gun.user().get('alias').on((v) => {
        this.subUser.value.username = v;
        resolve(v)});
    })
  }

/// Remove my ToDo
/// Parameter: * task as Task Identifier of ToDo - Path
  removeToDo(task: Task ) {
    this.user.get(graphDBKey).unset(task.parentKey);
  }
/// Remove Task from ToDo
/// Parameter: * task as Identificator for Task of ToDo - Path
  removeTaskFromToDo(task: Task): Promise<boolean> {
    return new Promise<boolean>((resolve) => {
      this.getToDo(task.parentKey).then(todo=>{
        todo.removeTask(task);
        this.removed.next(true);
        this.addToDo(todo).then(x=>{
          resolve(true);
        })
      })
    })
  }

  updateTaskFromToDo(task: Task): Promise<boolean> {
    return new Promise<boolean>((resolve) => {
      this.getToDo(task.parentKey).then(todo=>{
        todo.updateTask(task);
        this.addToDo(todo).then(x=>{
          resolve(true);
        })
      })
    })
  }
  
/// Remove Task from ToDo
/// Parameter: * task as Identificator for Task of ToDo - Path
  async changePrivacyOfToDo(toDo: ToDo, priv: boolean): Promise<boolean>  {
    return new Promise<boolean>(async (resolve) => {
      let decryptKey: string
      let pair: string

      if (priv) {
        decryptKey = "";
        pair = this.user.pair().priv;
      } else {
        decryptKey = this.user.pair().pub;
        pair = this.user.pair().pub;
      }

      this.db.gun.get(graphDBKey).get(toDo.key, async function(ack) {
          // Get Output of DB-Entry
          let message = ack.put as dbEntry;
          // Decrypt Message to Object
          let decryptToDo= await Gun.SEA.decrypt(message.message, pair);
          let object = decryptToDo as _ToDo;
          // Crypt with the spec. Pair 
          let newMessage = await Gun.SEA.encrypt(object, pair);
          // Create DBEntry with Data, DataType and DecryptionKey
          // DecryptionKey = "" --> Private Pair Key Only
          // DecryptionKey != "" --> Is Encryption Key of Data 
          let element = new dbEntry(newMessage, dbEntryType.todo, decryptKey);
          // Save in DB
          this.db.gun.get('todos').get(toDo.key).put(element);
          // Resolve Function
          resolve(priv);
      })
    })
  }
}

