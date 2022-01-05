
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ShowcaseToDoComponent } from '../showcase-to-do/showcase-to-do.component';
import { TaskComponent } from '../task/task.component';
import { ToDoComponent } from '../to-do/to-do.component';


@NgModule({
  declarations: [
    ShowcaseToDoComponent,
    TaskComponent,
    ToDoComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
  
  ],
  exports: [
    ShowcaseToDoComponent,
    TaskComponent,
    ToDoComponent
  ]
})
export class ComponentsModule { }
