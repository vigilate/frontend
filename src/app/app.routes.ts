import { provideRouter, RouterConfig } from '@angular/router';

import { DashboardComponent } from './dashboard.component'
import { LoginComponent } from './login.component'
import { ProgramsComponent } from './programs.component'
import { ProgramsDetailComponent } from './programs-detail.component'
import { AuthGuard } from './auth.guard'
import { AuthService } from './auth.service'
import { ProgramsService } from './programs.service';
import { UserService } from './user.service';
import { HttpServiceError } from './http-service-error.class'
import { AlertsService } from './alerts.service';
import { StorageService } from './storage.service';
import { BackgroundService } from './background.service';
import { StationsService } from './stations.service';
import { AlertsComponent } from './alerts.component';
import { StationsComponent } from './stations.component';
import { SettingsComponent } from './settings.component';
import { AlertsDetailComponent } from './alerts-detail.component';
import { Backend } from './backend.class'
import { Api } from './api.service'

export const routes: RouterConfig = [
    { path: '/dashboard',
      component: DashboardComponent,
      index:true,
      canActivate: [AuthGuard]},
    { path: '/login', component: LoginComponent },
    { path: '/programs', component: ProgramsComponent, canActivate: [AuthGuard] },
    { path: '/programs/:id', component: ProgramsDetailComponent, canActivate: [AuthGuard] },
    { path: '/alerts', component: AlertsComponent, canActivate: [AuthGuard] },
    { path: '/alerts/:id', component: AlertsDetailComponent, canActivate: [AuthGuard] },
    { path: '/settings', component: SettingsComponent, canActivate: [AuthGuard] },
    { path: '/stations', component: StationsComponent, canActivate: [AuthGuard] }
];

export const APP_ROUTER_PROVIDERS = [
    provideRouter(routes),
    [AuthGuard, AuthService, ProgramsService, UserService, HttpServiceError, Backend, AlertsService, StorageService, BackgroundService, StationsService, Api]
];
