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
import { UserService } from './user.service';

@Injectable()
export class BackgroundService {

    @Output() cntAlertChange = new EventEmitter();
    @Output() cntTotalAlert = new EventEmitter();
    @Output() cntTotalProg = new EventEmitter();
    @Output() cntTotalStation = new EventEmitter();
    
    constructor (private alertsService: AlertsService,
		 private programsService: ProgramsService,
		 private stationsService: StationsService,
		 private userService: UserService) {}

    init() {
	this.userService.getStats()
	.subscribe(stats => {
	    this.cntAlertChange.emit(stats.new_alerts)
	    this.cntTotalAlert.emit(stats.alerts)
	    this.cntTotalProg.emit(stats.programs)
	    this.cntTotalStation.emit(stats.stations)
	});
    }
}
