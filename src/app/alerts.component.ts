import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { User } from './user.model';
import { AuthService } from './auth.service';
import { AlertsService } from './alerts.service';
import { AlertComponent } from 'ng2-bootstrap/components/alert';
import {PaginatePipe, PaginationControlsCmp, PaginationService} from 'ng2-pagination/dist/ng2-pagination';
import { StationsService } from './stations.service';
import { StorageService } from './storage.service'
import { StationPipe } from './station.pipe';

@Component({
    selector: 'alerts',
    templateUrl: 'app/alerts.component.html',
    directives: [AlertComponent, PaginationControlsCmp],
    pipes: [PaginatePipe, StationPipe],
    providers: [PaginationService]
})

export class AlertsComponent implements OnInit, OnDestroy {

    cacheSubscription = null;
    alertsHtml:Array<Object> = []
    alerts = []
    p = 0;
    stations_list = []
    stations = {}
    filtered_station = 'all';
    loadingMarkAll = {
	read: false,
	unread: false
    };
    
    constructor (private authService: AuthService,
		 private alertsService: AlertsService,
		 private router: Router,
		 private storageService: StorageService,
		 private stationsService: StationsService){}

    ngOnInit() {
	this.p = this.storageService.get("AlertsComponent", "page", 1);
	this.updateList()

	this.cacheSubscription = this.alertsService.cacheTimeout.subscribe(
	    () => {
		this.updateList();
	    }
	);
    }

    ngOnDestroy() {
	if (this.cacheSubscription)
	    this.cacheSubscription.unsubscribe();
    }

    updateList() {
	this.stationsService.getStationsList().subscribe(stations => {
	    this.stations_list = stations;
	    for (let st of stations)
		this.stations[st.id] = st.name;
	    this.updateListAlertOnly();
	});
}
    
    updateListAlertOnly() {
	this.alertsService.getAlertsList()
            .subscribe(
                alerts => {
		    for (let i = 0 ; i < alerts.length ; i++)
		    {
			alerts[i].loadingMark = false;
		    }
		    this.alerts = alerts;
		    
		},
                error =>  {
		    if (error == "NeedToReconnect")
			throw error;
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
	obj.loadingMark = true;
	if (obj.view) {
	    this.alertsService.markUnread(obj.id)
		.subscribe(
                    ret => {
			obj.loadingMark = false;
			this.alertsService.trigerEmitTimeout()
		    },
                    error =>  {
			obj.loadingMark = false;
			if (error == "NeedToReconnect")
			    throw error;
			console.log(error);
		    });
	}
	else {
	    this.alertsService.markRead(obj.id)
		.subscribe(
                    ret => {
			obj.loadingMark = false;
			this.alertsService.trigerEmitTimeout()
		    },
                    error =>  {
			obj.loadingMark = false;
			if (error == "NeedToReconnect")
			    throw error;
			console.log(error);
		    });
	}
    }

    onMarkAll(act) {
	this.loadingMarkAll[act] = true;
	let fct;

	if (act == 'unread')
	    fct = this.alertsService.markAllUnread();
	else
	    fct = this.alertsService.markAllRead();

	fct.subscribe(
            ret => {
		this.loadingMarkAll[act] = false;
		this.alertsService.trigerEmitTimeout()
	    },
            error =>  {
		this.loadingMarkAll[act] = false;
		if (error == "NeedToReconnect")
		    throw error;
		console.log(error);
	    });
    }

    selectStation(st) {
	this.filtered_station = st;
    }
}
