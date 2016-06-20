import { provideRouter, RouterConfig } from '@angular/router';

import { DashboardComponent } from './dashboard.component'
import { LoginComponent } from './login.component'
import { AuthGuard } from './auth.guard'
import { AuthService } from './auth.service'

export const routes: RouterConfig = [
    { path: '/dashboard',
      component: DashboardComponent,
      index:true,
      canActivate: [AuthGuard]},
    { path: '/login', component: LoginComponent },
    // { path: '/programs', component: HeroListComponent },
    // { path: '/programs/:id', component: HeroDetailComponent }
];

export const APP_ROUTER_PROVIDERS = [
    provideRouter(routes),
    [AuthGuard, AuthService]
];
