import { Injectable, Output, EventEmitter } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { User } from './user.model';
import { HttpServiceError } from './http-service-error.class'
import { Backend } from './backend.class'
import { UserService } from './user.service';
import { NotificationsService } from './notifications.service'

@Injectable()
export class BackgroundService {

    @Output() cntAlertChange = new EventEmitter();
    @Output() cntTotalAlert = new EventEmitter();
    @Output() cntTotalProg = new EventEmitter();
    @Output() cntTotalStation = new EventEmitter();

    update_interval = 10;
    intervalId = -1;
    last_update_request = 0;
    is_new = true;
    stats = null;

    stats_dic = {
	"alerts": {name: "alert", "+": "alert", "-": "success"},
	"programs": {name: "program", "+": "info", "-": "info"},
	"stations": {name: "station", "+": "info", "-": "info"}
    };
    
    constructor (private userService: UserService,
		 private notificationsService: NotificationsService
		) {}

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
	let current_time = new Date().getTime()/1000;
	if (current_time - this.last_update_request < 1)
	    return;
	this.last_update_request = current_time;
	this.is_new = false;
	this.userService.getStats()
	    .subscribe(stats => {
		this.processNotification(stats);
		this.stats = stats;
		this.cntAlertChange.emit(stats.new_alerts)
		this.cntTotalAlert.emit(stats.alerts)
		this.cntTotalProg.emit(stats.programs)
		this.cntTotalStation.emit(stats.stations)
	});
    }

    stop() {
	clearInterval(this.intervalId);
    }

    processNotification(stats) {
	if (this.stats == null)
	    return;

	for (let key of Object.keys(this.stats_dic)) {
	    let name = this.stats_dic[key].name;
	    let diff = stats[key] - this.stats[key];
	    let plural = Math.abs(diff) > 1;
	    let sign = diff > 0 ? "+" : "-";

	    if (!diff)
		continue;
	    let msg = " "
		+ name
		+ (plural ? "s" : "")
		+ " has been "
		+ (sign == "+" ? "added" : "removed")
		+ ".";

	    this.notificationsService.push(this.stats_dic[key][sign], Math.abs(diff) + msg);
	}
    }
}
