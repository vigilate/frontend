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
import { FilterPipe } from './filter.pipe';

@Component({
    selector: 'alerts',
    templateUrl: 'app/alerts.component.html',
    directives: [AlertComponent, PaginationControlsCmp],
    pipes: [PaginatePipe, StationPipe, FilterPipe],
    providers: [PaginationService]
})

export class AlertsComponent implements OnInit, OnDestroy {

    pageLoading = true;
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

    filter = "";
    filter_options = ["is:read",
		      "is:!read",
		      "state:exploit",
		      "state:patch",
		      "version:",
		      "station:"
		     ];
    
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
	this.pageLoading = true;
	this.stationsService.getStationsList().subscribe(stations => {
	    this.stations_list = stations;
	    for (let st of stations)
		this.stations[st.id] = st.name;
	    this.updateListAlertOnly();
	});
}
    
    updateListAlertOnly() {
	this.pageLoading = true;
	this.alertsService.getAlertsList()
            .subscribe(
                alerts => {
		    for (let i = 0 ; i < alerts.length ; i++)
		    {
			alerts[i].loadingMark = false;
			alerts[i].program_info.station_name = this.stations[alerts[i].program_info.poste];
		    }
		    this.alerts = alerts;
		    this.pageLoading = false;
		},
                error =>  {
		    this.pageLoading = false;
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

    onClickFilter(f) {
	this.filter = this.filter + " " + f;
    }

    onClickRefresh() {
	this.alertsService.trigerEmitTimeout();
    }
}
