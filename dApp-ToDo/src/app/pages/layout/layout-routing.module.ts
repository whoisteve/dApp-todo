import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LayoutPage } from './layout.page';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: 'login',
    loadChildren: () => import('../login/login.module').then( m => m.LoginPageModule)
  },
  {
    path: '',
    component: LayoutPage,
    children: [
  {
    path: 'home',
    loadChildren: () => import('../main/main.module').then( m => m.MainPageModule)
  },
  {
    path: 'task/:toDo',
    loadChildren: () => import('../to-do/to-do.module').then( m => m.ToDoPageModule)
  },
  {
    path: 'allToDo',
    loadChildren: () => import('../all-to-dos/all-to-dos.module').then( m => m.AllToDosPageModule)
  }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LayoutPageRoutingModule {}
