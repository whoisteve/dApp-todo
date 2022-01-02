import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AllToDosPageRoutingModule } from './all-to-dos-routing.module';

import { AllToDosPage } from './all-to-dos.page';
import { ComponentsModule } from 'src/app/components/component/component.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AllToDosPageRoutingModule,
    ComponentsModule
  ],
  declarations: [AllToDosPage]
})
export class AllToDosPageModule {}
