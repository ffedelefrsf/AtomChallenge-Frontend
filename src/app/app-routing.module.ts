import { Component, NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { LoginComponent } from './screens/login/login.component';
import { Route } from './utils/routes.enum';
import { HomeComponent } from './screens/home/home.component';
import { AuthGuard } from './guards/auth.guard';
import { taskResolver } from './screens/home/resolvers/task.resolver';

@Component({
  selector: 'app-authenticated-parent-root',
  template: `
    <app-header></app-header>
    <router-outlet></router-outlet>
    <app-footer></app-footer>
  `,
  host: {
    class: 'content-wrapper',
  },
})
export class AuthenticatedParentComponent {}

@Component({
  selector: 'app-non-authenticated-parent-root',
  template: `
    <router-outlet></router-outlet>
    <app-footer></app-footer>
  `,
  host: {
    class: 'content-wrapper',
  },
})
export class NonAuthenticatedParentComponent {}

const routes: Routes = [
  {
    path: '',
    component: AuthenticatedParentComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: Route.HOME,
        component: HomeComponent,
        resolve: {
          tasksResponse: taskResolver,
        },
      },
    ],
  },
  {
    path: '',
    component: NonAuthenticatedParentComponent,
    children: [{ path: Route.LOGIN, component: LoginComponent }],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [],
})
export class AppRoutingModule {}
