import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Task, taskState } from 'src/app/models/toDo/task';
import { ToDo } from 'src/app/models/toDo/toDo';
import { GunService } from 'src/app/services/gun.service';

@Component({
  selector: 'task',
  templateUrl: './task.component.html',
  styleUrls: ['./task.component.scss'],
})
export class TaskComponent implements OnInit {


  @Input() task: Task;

  private input: string;
  //public task: Task = new Task("", taskState.unfinished);

  constructor(private gun: GunService) {

   }

  ngOnInit() {
    this.input = this.task.input;
  }

  removeTask(){
    console.log("This gonne be dstroyed : " + this.task.key + " of " + this.task.parentKey)
    this.gun.removeTaskFromToDo(this.task);
  }

  editTask(){
 
  }


  runInputChange(event: Event) {
    console.log(this.input)
  }

}
