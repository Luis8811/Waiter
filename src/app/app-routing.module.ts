import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: 'home/:language',
    loadChildren: './home/home.module#HomePageModule'
  },
  {
    path: 'list/:language',
    loadChildren: './list/list.module#ListPageModule'
  },
  { path: 'add-request/:language', loadChildren: './add-request/add-request.module#AddRequestPageModule' },
  { 
    path: 'close-request/:language',
    loadChildren: './close-request/close-request.module#CloseRequestPageModule'
  },
  { path: 'login', loadChildren: './login/login.module#LoginPageModule' }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
