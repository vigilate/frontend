import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { User } from './user.model';
import { AuthService } from './auth.service';
import { UserService } from './user.service';
import { BackgroundService } from './background.service';
import { StorageService } from './storage.service'

@Component({
    selector: 'dasboard',
    templateUrl: 'app/dashboard.component.html',
})

export class DashboardComponent implements OnInit {

    nb_total_prog = 0;
    nb_total_alert = 0;
    nb_total_station = 0;
    
    constructor (private authService: AuthService,
		 private userService: UserService,
		 private router: Router,
		 private backgroundService: BackgroundService,
		 private storageService: StorageService
		){}

    ngOnInit() {
	this.nb_total_prog = this.storageService.get("DashboardComponent", "total_prog", 0);
	this.nb_total_station = this.storageService.get("DashboardComponent", "total_station", 0);
	this.nb_total_alert = this.storageService.get("DashboardComponent", "total_alert", 0);
	
	this.backgroundService.cntTotalAlert
	    .subscribe(nb_total_alert => {
		this.nb_total_alert = nb_total_alert;
		this.storageService.store("DashboardComponent", "total_alert", nb_total_alert);
	    });

	this.backgroundService.cntTotalProg
	    .subscribe(nb_total_prog => {
		this.nb_total_prog = nb_total_prog;
		this.storageService.store("DashboardComponent", "total_prog", nb_total_prog);
	    });

	this.backgroundService.cntTotalStation
	    .subscribe(nb_total_station => {
		this.nb_total_station = nb_total_station;
		this.storageService.store("DashboardComponent", "total_station", nb_total_station);
	    });

	this.backgroundService.update();

    }
    
    logout() {
	this.authService.logout();
	this.backgroundService.stop()
	this.router.navigate(['/login']);
    }

    onClick(target) {
	this.router.navigate(['/' + target]);
    }
}
