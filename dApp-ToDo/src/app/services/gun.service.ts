import { Injectable } from '@angular/core';
// RxJs
import { BehaviorSubject, Observable } from 'rxjs';
import { ToDo, _ToDo } from '../models/toDo/toDo';
// Gun
import * as Gun from 'gun/gun';
require('gun/sea');

import { User } from '../models/user/user';
import { Task } from '../models/toDo/task';
import { GunDb } from './gunDb.service';
import { on$ } from './gun.helper';
import { resolve } from 'dns';


export enum loginMessage{unknownUser="Der Nutzer ist nicht bekannt", 
  wrongPassword="Username oder Password stimmen nicht", 
  userSameName="Username schon vorhanden", 
  success="", 
  timeout="Zeitüberschreitung der Anfrage", 
  shortPassword="Password zu kurz"}

export interface loginInterface {err: string}

@Injectable({
  providedIn: 'root'
})

export class GunService {
  public subUser: BehaviorSubject<User> = new BehaviorSubject(new User(""));

  public user = this.db.gun.user().recall({sessionStorage: true});


  constructor(private db: GunDb) { }

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

  logoutUser(): Promise <boolean> {
    return new Promise<boolean>((resolve) => {
      this.subUser = new BehaviorSubject(new User(""));
      this.user.leave();
      this.user = this.db.gun.user().recall({sessionStorage: true});
      resolve(true);
    });
  }

  // async updateToDoList(toDo: _ToDo): Promise <ToDoMap> {
  //   return new Promise<ToDoMap>((resolve, reject) => {
  //     this.db.gun.get("todo", function(ack){
  //       if(!ack.put){
  //         // not found
  //       } else {
  //         console.log(ack)
  //         // data!
  //       }
  //     })   
  //   })
  // }

  async addToDo(toDo?: ToDo): Promise<ToDo> {
    return new Promise<ToDo>((resolve, reject) => {
      let toDo:_ToDo
      if (toDo == undefined) {
        toDo = new _ToDo("Einkaufsliste");
      } else {
        toDo = toDo
      }
      this.db.gun.get('todo').get(toDo.key + "/" + toDo.title).put(toDo);
       // this.updateToDoList(toDo)
        //  this.db.gun.get("toDoList").put(x);
        // resolve(toDo);
      //  })
      })
  }

  async getToDo(key: string): Promise <ToDo> {
    return new Promise<ToDo>((resolve, reject) => {
      // get all of User
      // strip all ToDos
      // search for full url-tag
      // get url Tag and convert to ToDo




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
      this.db.gun.get("todo", function(ack){
        if(!ack.put){
          resolve ([])
        } else {
          console.log(ack)
          // convert to ToDoMap

          
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

  removeToDo(token: string, task: Task ) {
    console.log("Removed from: "+ token + " there Task" + task.input);
    
  }

  isLoggedIn(): Promise <boolean>  {
    return new Promise<boolean>((resolve) => {
      if (this.subUser.value.username!=""){
        resolve(true);
      }
      else {
        resolve(false);
      }
    })
  }
}

