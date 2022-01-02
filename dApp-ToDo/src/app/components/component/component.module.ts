
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InputBarComponent } from '../input-bar/input-bar.component';
import { ShowcaseTaskComponent } from '../showcase-task/showcase-task.component';
import { ShowcaseToDoComponent } from '../showcase-to-do/showcase-to-do.component';
import { TaskComponent } from '../task/task.component';
import { ToDoComponent } from '../to-do/to-do.component';


@NgModule({
  declarations: [
    InputBarComponent,
    ShowcaseTaskComponent,
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
    InputBarComponent,
    ShowcaseTaskComponent,
    ShowcaseToDoComponent,
    TaskComponent,
    ToDoComponent
  ]
})
export class ComponentsModule { }
