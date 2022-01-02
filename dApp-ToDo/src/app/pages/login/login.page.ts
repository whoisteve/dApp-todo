import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  private username: string;
  private password: string;

  public errorMessage: string = "Message";

  constructor() { }

  ngOnInit() {
  }

  runInputChange(event: Event) {
    console.log(event);
    this.errorMessage = "";
  }

  showError(){
    
  }

}
