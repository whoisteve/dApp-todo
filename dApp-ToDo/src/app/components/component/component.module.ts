
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TaskComponent } from '../task/task.component';
import { ToDoComponent } from '../to-do/to-do.component';


@NgModule({
  declarations: [
    TaskComponent,
    ToDoComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
  
  ],
  exports: [
    TaskComponent,
    ToDoComponent
  ]
})
export class ComponentsModule { }
