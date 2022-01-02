import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Task } from 'src/app/models/toDo/task';
import { ToDo } from 'src/app/models/toDo/toDo';
import { GunService } from 'src/app/services/gun.service';

@Component({
  selector: 'app-to-do',
  templateUrl: './to-do.page.html',
  styleUrls: ['./to-do.page.scss'],
})
export class ToDoPage implements OnInit {

  private toDo: ToDo;

  constructor(private router: ActivatedRoute, private gun: GunService ) { 
    this.router.params.subscribe(params => {
      let toDoToken = params['toDo'];
        this.gun.getToDo(toDoToken).then(toDo => {
          this.toDo = toDo;
        })
    })
    // subscribe to task
  }

  ngOnInit() {
  }

  runInputChange(event: Event) {
    console.log(event);
  }
}
