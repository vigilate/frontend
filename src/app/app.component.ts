import { Component, ViewChild, OnInit } from '@angular/core';

import { LoginComponent } from './login.component';
import { AuthService } from './auth.service';
import { ProgramsService } from './programs.service';
import { ROUTER_DIRECTIVES } from '@angular/router';

import './rxjs-operators';

@Component({
    moduleId: module.id,
    selector: 'app-root',
    templateUrl: 'app.component.html',
    styleUrls: ['app.component.css'],
    directives: [ROUTER_DIRECTIVES, LoginComponent]
})

export class AppComponent {

    routes = [
	{name: "Dasboard", path: "/dashboard", active: false},
	{name: "Programs", path: "/programs", active: false},
	{name: "Alerts", path: "/alerts", active: false},
	{name: "Settings", path: "/settings", active: false},
	{name: "Tools", path: "/tools", active: false}
    ]
    
    constructor (private authService: AuthService, private programsService: ProgramsService) {}
}
