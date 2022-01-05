import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Task, taskState } from 'src/app/models/toDo/task';
import { ToDo, _ToDo } from 'src/app/models/toDo/toDo';
import { GunService } from 'src/app/services/gun.service';

@Component({
  selector: 'app-to-do',
  templateUrl: './to-do.page.html',
  styleUrls: ['./to-do.page.scss'],
})
export class ToDoPage implements OnInit {

  private toDo: ToDo;
  private inputTask: string;
  private inputChanged: boolean = false;
  private inputToDo: string="";

  constructor(private router: ActivatedRoute, private gun: GunService ) { 
    this.reloadToDo();
    this.gun.removed.subscribe(x=>{
      if (x){
        window.location.reload();
      }
    })
  }

  reloadToDo(){
    this.router.params.subscribe(params => {
      let key = params['toDo'];
        this.gun.getToDo(key).then(toDo => {
          this.toDo = toDo;
          this.inputToDo = toDo.title;
        })
    })
  }

  ngOnInit() { }

  ionViewWillEnter() {
    this.router.params.subscribe(params => {
      let key = params['toDo'];
        this.gun.getToDo(key).then(toDo => {
          this.toDo = toDo;
        })
    })
}

  runInputChange(event: Event) {
    this.inputChanged = true;
  }

  changeToDoName(){
    this.toDo.title = this.inputToDo;
    let _toDo = new _ToDo(this.toDo.title);
    _toDo.key = this.toDo.key;
    _toDo.tasks = this.toDo.tasks;
    this.gun.updateToDoList(_toDo).then(y=>{
      this.gun.addToDo(this.toDo).then(x=>{
        this.gun.toDoUpdated.next(true);
        this.toDo = x;
        this.inputChanged = false;
      })
    })
  }

  updateToDo(){
    this.gun.addToDo(this.toDo).then(x=>{
      this.toDo = x;
    })
  }

  addTask(){
    if (this.inputTask != "" && this.inputTask != undefined) {
      let task = new Task(this.inputTask, taskState.unfinished, this.toDo.key);
      task.init()
      this.toDo.addTask(task);
      this.gun.addToDo(this.toDo).then(x=>{
        this.inputTask=""
      });
    } 
  }

  removeTask(task: Task){
    this.router.params.subscribe(params => {
      let key = params['toDo'];
      task.parentKey = key;
      this.gun.removeTaskFromToDo(task).then(removed=>{
        this.gun.getToDo(task.parentKey).then(toDo => {
          this.toDo = toDo;
        })
      })   
    })
  }
}
