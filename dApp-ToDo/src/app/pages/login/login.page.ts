import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { User } from 'src/app/models/user/user';
import { GunService, loginMessage } from 'src/app/services/gun.service';
import { GunDb } from 'src/app/services/gunDb.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  private username: string="";
  private password: string="";

  public errorMessage: string = "";

  constructor(private gun: GunService, private router: Router) {
  }

  ngOnInit() {

  }
  ionViewWillEnter() {
    this.gun.isLoggedIn().then(x=> {
      if (x) {
        this.router.navigate(['/app/home']);
      }
    })
}

  runInputChange(event: Event) {
    this.errorMessage = "";
  }

  showError(message:string){
    this.errorMessage = message;
    
  }

  signUpUser() {
    console.log(this.username, this.password)
    this.gun.signUpUser(this.username, this.password).then(x=> {
      console.log(x);
      this.showError(x.toString());
      if (x == loginMessage.success) {
        this.gun.loginUser(this.username, this.password).then(y=> {
          this.gun.subUser = new BehaviorSubject(new User(this.username));
          this.username = "";
          this.password = "";
          this.router.navigate(['/app/home']);
        })
      }
    })
  }

  signInUser() {
   // this.gun.getToDo("dasd");
    if (this.username =="" && this.password =="") {
      this.showError("Keine Logindaten");
    }
    this.gun.loginUser(this.username, this.password).then(x=> {
      console.log(x);
      this.showError(x.toString());
      if (x == loginMessage.success) {
        this.gun.subUser = new BehaviorSubject(new User(this.username));
        this.username = "";
        this.password = "";
        this.router.navigate(['/app/home']);
      }
    })
  }

}
