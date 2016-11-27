/* tslint:disable: max-line-length */
import { Routes } from '@angular/router';

import { DashboardComponent } from '../features/dashboard.component';
import { ErrorNotFoundComponent } from '../pages/error-not-found/error-not-found.component';

export const routes: Routes = [
  { path: '', component: DashboardComponent, pathMatch: 'full' },
  { path: 'lazy', loadChildren: '../features/lazy/index#LazyModule' },
  { path: 'sync', loadChildren: '../features/sync/index#SyncModule?sync=true' },
  { path: '**', component: ErrorNotFoundComponent }
];
