import { NgModule, Injectable } from '@angular/core';
import * as GUN from 'gun';
import * as Gun from 'gun/gun';
require('gun/sea');
require('gun/axe');


@Injectable()
export class GunDb {
    readonly gun = GUN(['http://localhost:8080/gun', 'https://gun-manhattan.herokuapp.com/gun']);
  static gun: any;
}

