import { Component, OnInit } from '@angular/core';

import { LoginComponent } from './login.component';
import { AuthService } from './auth.service';
import { ProgramsService } from './programs.service';
import { BackgroundService } from './background.service';
import { ROUTER_DIRECTIVES } from '@angular/router';
import { Backend } from './backend.class'

import './rxjs-operators';

@Component({
    moduleId: module.id,
    selector: 'app-root',
    templateUrl: 'app.component.html',
    styleUrls: ['app.component.css'],
    directives: [ROUTER_DIRECTIVES, LoginComponent]
})

export class AppComponent implements OnInit {

    nb_new_alert = 0
    
    routes = [
	{name: "Dasboard", path: "/dashboard", active: false},
	{name: "Programs", path: "/programs", active: false},
	{name: "Alerts", path: "/alerts", active: false},
	{name: "Settings", path: "/settings", active: false},
	{name: "Stations", path: "/stations", active: false}
    ]
    
    constructor (private authService: AuthService,
		 private programsService: ProgramsService,
		 private backgroundService: BackgroundService,
		 private backend: Backend
		) {}

    ngOnInit() {
	this.backgroundService.cntAlertChange
	    .subscribe(nb_new_alert => {
		this.nb_new_alert = nb_new_alert
	    });
    }

    onImgClick() {
	let new_url = prompt("Backend URL:", this.backend.getHost());
	if (new_url != null && new_url != this.backend.getHost())
	{
	    this.backend.setHost(new_url);
	}
    }
}
