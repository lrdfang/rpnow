import { NgModule } from '@angular/core';
import { RouterModule, Routes, PreloadAllModules } from '@angular/router';

import { NotFoundComponent } from './not-found/not-found.component';

const appRoutes: Routes = [
  {
    path: 'rp',
    loadChildren: './rp/rp.module#RpModule'
  },
  {
    path: 'terms',
    loadChildren: './terms/terms.module#TermsModule'
  },
  {
    path: '**',
    component: NotFoundComponent
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(appRoutes, {
      paramsInheritanceStrategy: 'always',
      preloadingStrategy: PreloadAllModules,
      onSameUrlNavigation: 'reload'
    })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
