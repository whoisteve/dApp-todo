import { Component, OnInit } from '@angular/core';
import { ToDo } from 'src/app/models/toDo/toDo';
import { User } from 'src/app/models/user/user';
import { GunService } from 'src/app/services/gun.service';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.page.html',
  styleUrls: ['./layout.page.scss'],
})
export class LayoutPage implements OnInit {

  private toDos: ToDo[] = [];
  private user: User;
  private username:string = "Dummy"

  constructor(private gun: GunService) {

    this.gun.getUsername().then(name => {
      this.username = name;
    })

    this.gun.subUser.subscribe(subUser=> {
      this.user = subUser;
      // update anyhting where user was drawn
    })



    // subscription to service BehaviorSubject to get user Content
   }

   updateUI(){

   }


  ngOnInit() {
  }

}
