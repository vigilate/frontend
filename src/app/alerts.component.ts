import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { User } from './user.model';
import { AuthService } from './auth.service';
import { AlertsService } from './alerts.service';
import { AlertComponent } from 'ng2-bootstrap/components/alert';
import {PaginatePipe, PaginationControlsCmp, PaginationService} from 'ng2-pagination/dist/ng2-pagination';
import { StorageService } from './storage.service'

@Component({
    selector: 'alerts',
    templateUrl: 'app/alerts.component.html',
    directives: [AlertComponent, PaginationControlsCmp],
    pipes: [PaginatePipe],
    providers: [PaginationService]
})

export class AlertsComponent implements OnInit {

    alertsHtml:Array<Object> = []
    alerts = []
    p = 0;
    
    constructor (private authService: AuthService,
		 private alertsService: AlertsService,
		 private router: Router,
		 private storageService: StorageService){}

    ngOnInit() {
	this.p = this.storageService.get("AlertsComponent", "page", 1);
	this.updateList()
    }

    updateList() {
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
	this.router.navigate(['/alerts', id]);
    }

    onPageChange(page) {
	this.storageService.store("AlertsComponent", "page", page);
    }

    onMark(obj) {
	if (obj.view) {
	    this.alertsService.markUnread(obj.id)
		.subscribe(
                    ret => {
			this.alertsService.discardCache()
			this.updateList()
		    },
                    error =>  {
			console.log(error);
		    });
	}
	else {
	    this.alertsService.markRead(obj.id)
		.subscribe(
                    ret => {
			this.alertsService.discardCache()
			this.updateList()
		    },
                    error =>  {
			console.log(error);
		    });
	}
    }

}
