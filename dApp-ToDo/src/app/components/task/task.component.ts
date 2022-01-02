import { Component, Input, OnInit } from '@angular/core';
import { Task, taskState } from 'src/app/models/toDo/task';
import { ToDo } from 'src/app/models/toDo/toDo';
import { GunService } from 'src/app/services/gun.service';

@Component({
  selector: 'task',
  templateUrl: './task.component.html',
  styleUrls: ['./task.component.scss'],
})
export class TaskComponent implements OnInit {

  @Input() token: string; 
  @Input() task: Task;
  //public task: Task = new Task("", taskState.unfinished);

  constructor() {
   
   }

  ngOnInit() {}

  removeTask(){
    // call Service to remove Task via ToDo Token
    console.log(this.token + " and from this remove Task: " + this.task.input);
    //GunService.removeToDo(this.token, this.task);
  }

}
