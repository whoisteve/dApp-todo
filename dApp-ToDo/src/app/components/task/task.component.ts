import { Component, Input, OnInit } from '@angular/core';
import { Task, taskState } from 'src/app/models/toDo/task';
import { GunService } from 'src/app/services/gun.service';

@Component({
  selector: 'task',
  templateUrl: './task.component.html',
  styleUrls: ['./task.component.scss'],
})
export class TaskComponent implements OnInit {


  @Input() task: Task;
  
  private finsihed: boolean;
  private input: string;

  constructor(private gun: GunService) {

   }

  ngOnInit() {
    this.input = this.task.input;
    if (this.task.state == taskState.finished) {
      this.finsihed = true;
    } else {
      this.finsihed = false;
    }
  }

  removeTask(){
    this.gun.removeTaskFromToDo(this.task);
  }

  tickTask(){
    this.gun.updateTaskFromToDo(this.task);
  }

  tickValue(value: boolean) {
    this.finsihed = value;
    if (value) {
      this.task.state = taskState.finished
    } else {
      this.task.state = taskState.unfinished
    }
    this.tickTask();
  }

  runInputChange(event: Event) {
    console.log(this.input)
  }

}
