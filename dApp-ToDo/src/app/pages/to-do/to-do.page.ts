import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Task, taskState } from 'src/app/models/toDo/task';
import { ToDo } from 'src/app/models/toDo/toDo';
import { GunService } from 'src/app/services/gun.service';

@Component({
  selector: 'app-to-do',
  templateUrl: './to-do.page.html',
  styleUrls: ['./to-do.page.scss'],
})
export class ToDoPage implements OnInit {

  private toDo: ToDo;
  private inputTask: string;

  constructor(private router: ActivatedRoute, private gun: GunService ) { 
    this.router.params.subscribe(params => {
      let key = params['toDo'];
        this.gun.getToDo(key).then(toDo => {
          this.toDo = toDo;
          console.log("FOR LOOP")
          for (var entry of toDo.tasks) {
            console.log(entry.parentKey + " as " + entry.key + " of " + entry.input);
          }
        })
    })

  }

  ngOnInit() {
 
  }

  ionViewWillEnter() {
    this.router.params.subscribe(params => {
      let key = params['toDo'];
        this.gun.getToDo(key).then(toDo => {
          this.toDo = toDo;
          console.log("FOR LOOP")
          for (var entry of toDo.tasks) {
            console.log(entry.parentKey + " as " + entry.key + " of " + entry.input);
          }
        })
    })
}


  runInputChange(event: Event) {
    console.log(event);
  }

  updateToDo(){
    this.gun.addToDo(this.toDo).then(x=>{
      this.toDo = x;
    })
  }

  addTask(){
    console.log(this.inputTask);
    if (this.inputTask != "" && this.inputTask != undefined) {
      let task = new Task(this.inputTask, taskState.unfinished, this.toDo.key);
      task.init()
      this.toDo.addTask(task);
      console.log(this.toDo.key)
      this.gun.addToDo(this.toDo);
    } 
  }

  removeTask(task: Task){
    // call Service to remove Task via ToDo Token
   
    //GunService.removeToDo(this.token, this.task);

    this.router.params.subscribe(params => {
      let key = params['toDo'];
      console.log("REMOVE REMOVE of " +(task.input))
      task.parentKey = key;
      this.gun.removeTaskFromToDo(task).then(removed=>{
        this.gun.getToDo(task.parentKey).then(toDo => {
          this.toDo = toDo;
        })
      })   
    })

  }

  editTask(task: Task){
    // call Service to remove Task via ToDo Token
   
    //GunService.removeToDo(this.token, this.task);
    this.gun.removeTaskFromToDo(task).then(removed=>{
      
    })
  }
}
