import { Injectable, Output, EventEmitter } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';

import { Observable } from 'rxjs/Observable';
import { User } from './user.model';
import { AuthService } from './auth.service';
import { HttpServiceError } from './http-service-error.class'
import { Backend } from './backend.class'
import { AlertsService } from './alerts.service';
import { ProgramsService } from './programs.service';
import { StationsService } from './stations.service';

@Injectable()
export class BackgroundService {

    @Output() cntAlertChange = new EventEmitter();
    @Output() cntTotalAlert = new EventEmitter();
    @Output() cntTotalProg = new EventEmitter();
    @Output() cntTotalStation = new EventEmitter();
    
    constructor (private alertsService: AlertsService,
		 private programsService: ProgramsService,
		private stationsService: StationsService) {}

    init() {
	this.get_number_list();
    }

    get_number_list() {
	this.alertsService.getAlertsList()
            .subscribe(
                alerts => {
		    let cnt = 0;
		    for (let i = 0 ; i < alerts.length; i++) {
			if (!alerts[i].view)
			    cnt++;
		    }
		    this.cntAlertChange.emit(cnt);
		    this.cntTotalAlert.emit(alerts.length);
		    },
                error =>  {
		    console.log(error);
		});

	this.programsService.getProgramsList()
            .subscribe(
                progs => {
		    this.cntTotalProg.emit(progs.length);
		    },
                error =>  {
		    console.log(error);
		});

	this.stationsService.getStationsList()
            .subscribe(
                stations => {
		    this.cntTotalStation.emit(stations.length);
		    },
                error =>  {
		    console.log(error);
		});

	
    }
}
