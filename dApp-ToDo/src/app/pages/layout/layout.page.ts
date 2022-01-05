import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToDo, _ToDo } from 'src/app/models/toDo/toDo';
import { User } from 'src/app/models/user/user';
import { GunService } from 'src/app/services/gun.service';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.page.html',
  styleUrls: ['./layout.page.scss'],
})
export class LayoutPage implements OnInit {

  private toDos: ToDo[] = [];
  private username:string = "Dummy"
  private user: User = new User(this.username);


  constructor(private gun: GunService,  private router: Router) {
    this.gun.toDoUpdated.subscribe(x=>{
      if(x){
        this.reloadToDos();
      }
    })
   }

   ionViewWillEnter() {
     
    this.gun.getUsername().then(name => {
      this.username = name;

      if (this.gun.subUser != undefined) {
        this.gun.subUser.subscribe(subUser=> {
          this.user = subUser;
          
        })
      }
      this.reloadToDos();
    })
}

reloadToDos(){
  this.gun.getMyToDos().then(toDos=>{
    console.log(toDos);
    this.gun.subUser.value.toDos= toDos;
  })
}

   

   updateUI(){

   }


  ngOnInit() {
  }

  addToDo(){
    console.log("addToDo")
    this.gun.addToDo().then(x=>{
     this.user.addToDo(x);
    })
  }
  
  logout() {
    this.gun.logoutUser().then(x=>{
      this.router.navigate(['/app/login']);
    })
  }

}
