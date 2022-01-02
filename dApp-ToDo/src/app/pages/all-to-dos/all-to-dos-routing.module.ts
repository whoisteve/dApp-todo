import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AllToDosPage } from './all-to-dos.page';

const routes: Routes = [
  {
    path: '',
    component: AllToDosPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AllToDosPageRoutingModule {}
