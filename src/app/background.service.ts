import { Injectable, Output, EventEmitter } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { User } from './user.model';
import { HttpServiceError } from './http-service-error.class'
import { Backend } from './backend.class'
import { UserService } from './user.service';

@Injectable()
export class BackgroundService {

    @Output() cntAlertChange = new EventEmitter();
    @Output() cntTotalAlert = new EventEmitter();
    @Output() cntTotalProg = new EventEmitter();
    @Output() cntTotalStation = new EventEmitter();

    update_interval = 10;
    intervalId = -1;
    is_new = true;
    
    constructor (private userService: UserService) {}

    init() {
	if (this.intervalId == -1) {
	    this.intervalId = setInterval(
		() => {
		    this.update();
		},
		this.update_interval * 1000);
	}
	this.update();
    }

    update() {
	this.is_new = false;
	this.userService.getStats()
	    .subscribe(stats => {
		this.cntAlertChange.emit(stats.new_alerts)
		this.cntTotalAlert.emit(stats.alerts)
		this.cntTotalProg.emit(stats.programs)
		this.cntTotalStation.emit(stats.stations)
	});
    }

    stop() {
	clearInterval(this.intervalId);
    }
}
