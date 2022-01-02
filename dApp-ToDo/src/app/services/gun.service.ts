import { Injectable } from '@angular/core';
// RxJs
import { BehaviorSubject } from 'rxjs';
import { ToDo } from '../models/toDo/toDo';
// Gun
import * as GUN from 'gun';
import { User } from '../models/user/user';
import { Task } from '../models/toDo/task';


// Database
export const db = GUN();

// GUN User
//export const user = db.user()

@Injectable({
  providedIn: 'root'
})

export class GunService {
  public subUser: BehaviorSubject<User>;

  constructor() { 
    this.subUser = new BehaviorSubject(new User("DippShit"));

    // Building Dummy values
    let toDos: ToDo[] = [];
    let tasks: [Task] = [new Task("Input")];
    tasks.push(new Task("funny"));
    tasks.push(new Task("funny2"));
    toDos.push(new ToDo("Einkaufsliste", tasks));
    toDos.push(new ToDo("Einkaufsliste2", tasks));
    toDos.push(new ToDo("Einkaufsliste3", tasks));
    toDos.push(new ToDo("Einkaufsliste4", tasks));
    this.subUser.value.toDos = toDos;
  }

  async singupUser(username: string, password: string) {
    // user.create(username, password, (err) => {
    //   if (err) {
    //     alert(err);
    //   } else {
        
    //   }
    // })
  }


  async loginUser(username: string,password: string, secret: string): Promise <boolean> {
    return new Promise<boolean>((resolve, reject) => {
      /// write and get User Object
      let tasks: Task[];
      tasks.push(new Task("Tolle Erinnerung,"))
      let toDos = [new ToDo("Einkaufslsite")]
      let secret = "DecryptKey";
      this.subUser = new BehaviorSubject(new User(username, secret, toDos));

      resolve(true);
    })
  }

  logoutUser() {
  //  user.leave();
    this.subUser = undefined;
  }

  async getToDo(id: string): Promise <ToDo> {
    return new Promise<ToDo>((resolve, reject) => {
      // get toDo from GUN
      let toDo = this.subUser.getValue().toDos.find(item => item.title == id);
      console.log(toDo)
      resolve(toDo);
      })
  }

  async getPublicToDo(id: string): Promise <ToDo> {
    return new Promise<ToDo>((resolve, reject) => {
      /// get selected public ToDo and try to decrypt with secret
      })
  }

  async getMyToDos(): Promise <ToDo[]> {
    return new Promise<ToDo[]>((resolve, reject) => {
      /// getMyToDos
    })
  }


  /// Update ToDo
  async updateToDo(): Promise <ToDo> {
    return new Promise<ToDo>((resolve, reject) => {
      // write and get ToDo 
    })
  }

  async getUsername(): Promise <string> {
    return new Promise<string>((resovle, reject) => {
      // let username = user.get('alias');
      // if (username === undefined) {
      // //  reject(false);
      // } else {
      // //  resolve(username);
      // }
    })
  }


  removeToDo(token: string, task: Task ) {
    console.log("Removed from: "+ token + " there Task" + task.input);
  }
}
