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

const graphDBKey = "toDoKey"

@Injectable({
  providedIn: 'root'
})

export class GunService {
  public subUser: BehaviorSubject<User> = new BehaviorSubject(new User(""));

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
     return new Promise<loginMessage>((resolve, reject) => {
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
    toDo = new _ToDo("Einkaufsliste");
    toDo.init()
    } else {
      toDo = new _ToDo(updateToDo.title);
      toDo.key = updateToDo.key;
      toDo.tasks = updateToDo.tasks;
      toDo.key = updateToDo.key;
      toDo.updatePKey(updateToDo.key);
      console.log("SEE NOW")
      console.log(toDo.key)
      if (toDo.tasks.length != 0) {
        console.log(toDo.tasks[0].parentKey)
      }
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
      console.log(list)
       let message= await Gun.SEA.encrypt(list, this.user.pair().pub);
       console.log(message);
       let element = new dbEntry(message, dbEntryType.list, "");
       this.db.gun.get(graphDBKey).get("ListUserToDo4/" + this.user.pair().pub).put(element);
      return;
    })
 
    this.db.gun.get(graphDBKey).get(toDo.key, async function(ack) {
        // Get Output of DB-Entry
        let message = ack.put as dbEntry;
        // Decrypt Message to _ToDo Object
        let decryptToDo= await Gun.SEA.decrypt(message.message, pair);
        let object = decryptToDo as _ToDo;
        // Save element in Personal ToDos
        console.log("TODO set and updated")
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
      this.db.gun.get(graphDBKey).get("ListUserToDo4/" + pair , async function(ack){
        if (ack.put == undefined && !written) {
          console.log("New List")
          console.log(ack)
          list = new dbListEntries([(toDo.key)]);
          resolve(list);
          written = true
          return;
        } else if (!written){
          console.log("List is there")
          console.log(ack)
          let message = ack.put as dbEntry;
          // Decrypt Message to Object
          await Gun.SEA.decrypt(message.message, pair).then(decryptToDo =>{
            console.log("SEA")
            console.log(decryptToDo)
            let object = decryptToDo as dbListEntries;
            if (object == undefined) return;
            if (object.entries.includes(toDo.key)) {
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
      this.db.gun.get(graphDBKey).get("ListUserToDo4/" + pair , async function(ack){
        console.log(ack);
        if (ack.put == undefined) {
          resolve(new dbListEntries([]))
        } else {
          console.log("List is there")
          
          let message = ack.put as dbEntry;
          // Decrypt Message to Object
          await Gun.SEA.decrypt(message.message, pair).then(decryptToDo =>{
            let object = decryptToDo as dbListEntries;
            console.log(object)
            resolve(object)
          });
        }
      });
    })
  }


  async getToDo(key: string): Promise <ToDo> {
    console.log(key)
    return new Promise<ToDo>((resolve, reject) => {

      let pair = this.user.pair().priv;
      this.db.gun.get(graphDBKey).get(key, async function(ack) {
        console.log(ack)
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
                console.log(object.key)
                console.log(object.tasks.length)
                if (object.tasks.length != 0) {
                  console.log(object.tasks[0].parentKey)
                }
                let nToDo = new ToDo(object.title, object.key, object.tasks);
                resolve(nToDo)
              });
            }
          }
      })
      // let test =  this.db.gun.get('todo/'+ key + "/" + title, function(ack){
      //   let object = ack.put as ToDo;
      //   resolve(object)
      //   return;
      // })
    })
  }

  async getPublicToDo(id: string): Promise <ToDo> {
    return new Promise<ToDo>((resolve, reject) => {
      // get all users toDos

      /// get selected public ToDo and try to decrypt with secret
      })
  }

  async getMyToDos(): Promise <ToDo[]> {
    return new Promise<ToDo[]>((resolve, reject) => {
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
              console.log(toDos.findIndex(item => item.key == newToDo.key))
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
            console.log (toDos.length + " xx " +  list.entries.length)
            if (toDos.length === list.entries.length) {
              resolve(toDos)
              return;
            }
          })
        }    
      })  
    })
  }


  /// Update ToDo
  async updateToDo(): Promise <ToDo> {
    return new Promise<ToDo>((resolve, reject) => {
      // write and get ToDo 
    })
  }

  async getUsername(): Promise <string> {
    return new Promise<string>((resolve) => {
      this.user.get('alias').on((v) => {
        this.subUser.value.username = v;
        resolve(v)});
    })
  }

  removeToDo(task: Task ) {
    this.user.get(graphDBKey).unset(task.parentKey);
    
  }

  removeTaskFromToDo(task: Task): Promise<boolean> {
    console.log("removeTaskFromToDo - " + task.parentKey)
    return new Promise<boolean>((resolve) => {
      console.log(task.parentKey)
      this.getToDo(task.parentKey).then(todo=>{
        console.log(todo);
        todo.removeTask(task);
        console.log(todo);
        this.addToDo(todo).then(x=>{
          resolve(true);
        })
      })
    })

  }


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

