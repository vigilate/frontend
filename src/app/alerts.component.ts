import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { User } from './user.model';
import { AuthService } from './auth.service';
import { AlertsService } from './alerts.service';
import { AlertComponent } from 'ng2-bootstrap/components/alert';

@Component({
    selector: 'alerts',
    templateUrl: 'app/alerts.component.html',
    directives: [AlertComponent]
})

export class AlertsComponent implements OnInit {

    alertsHtml:Array<Object> = []
    alerts = []
    
    constructor (private authService: AuthService,
		 private alertsService: AlertsService,
		 private router: Router){}

    ngOnInit() {
	this.alertsService.getAlertsList()
            .subscribe(
                alerts => {
		    this.alerts = alerts;
			},
                error =>  {
		    console.log(error);
		});

    }

    onClick(id) {
    }

}
