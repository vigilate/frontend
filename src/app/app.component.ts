import { Component, OnInit } from '@angular/core';

import { LoginComponent } from './login.component';
import { AuthService } from './auth.service';
import { ProgramsService } from './programs.service';
import { BackgroundService } from './background.service';
import { Router, ROUTER_DIRECTIVES } from '@angular/router';
import { Backend } from './backend.class'
import { UserService } from './user.service';
import { NavigationExtras } from '@angular/router/router';
import './rxjs-operators';
import { StorageService } from './storage.service'
import { NotificationsComponent } from './notifications.component'

@Component({
    moduleId: module.id,
    selector: 'app-root',
    templateUrl: 'app.component.html',
    styleUrls: ['app.component.css'],
    directives: [ROUTER_DIRECTIVES, NotificationsComponent]
})

export class AppComponent implements OnInit {

    nb_new_alert = 0
    
    routes = [
	{name: "Dasboard", path: "/dashboard", active: true},
	{name: "Programs", path: "/programs", active: false},
	{name: "Alerts", path: "/alerts", active: false},
	{name: "Settings", path: "/settings", active: false},
	{name: "Stations", path: "/stations", active: false}
    ]

    activated_page = "";

    tour_current_step = "";
    
    constructor (private authService: AuthService,
		 private programsService: ProgramsService,
		 private backgroundService: BackgroundService,
		 private backend: Backend,
		 private userService: UserService,
		 private router: Router,
		 private storageService: StorageService
		) {}

    ngOnInit() {
	this.backgroundService.cntAlertChange
	    .subscribe(nb_new_alert => {
		this.nb_new_alert = nb_new_alert
	    });

	this.storageService.updated
	    .subscribe((obj) => {
		
		if (obj.client == "AuthGuard" && obj.key == "current_page")
		    this.activated_page = "/" + obj.value;
		if (obj.client == "Tour" && obj.key == "current_step") {
		    this.tour_current_step = obj.value;
		    console.log("Tour changed", obj.value);
		}
		    
	    });
    }

    onImgClick() {
	let new_url = prompt("Backend URL:", this.backend.getHost());
	if (new_url != null && new_url != this.backend.getHost())
	{
	    this.backend.setHost(new_url);
	}
    }

    logout() {
	this.router.navigate(['/logout']);
    }
}
