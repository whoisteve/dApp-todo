import { Component } from '@angular/core';
import * as Gun from 'gun/gun';
import { GunService } from './services/gun.service';
import { GunDb } from './services/gunDb.service';
@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {

  constructor(private gun: GunDb) {
    gun.gun.get('test').once(v => console.log(v))

  }
}
