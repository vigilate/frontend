import { Injectable, Output, EventEmitter } from '@angular/core';

import { Observable } from 'rxjs/Observable';

@Injectable()
export class NotificationsService {

    @Output() eventNew = new EventEmitter();
    @Output() eventExpired = new EventEmitter();
    current_id = 0;
    
    constructor () {}

    push(type, message, timeout=5) {
	this.current_id++;
	let id = this.current_id;
	let notif = {id:id , msg: message, type: type, expiring: false}
	this.eventNew.emit(notif);
	if (timeout != 0) {
	    setTimeout(
		() => {
		    this.eventExpired.emit(id);
		},
		timeout * 1000);
	}
    }

    info(message, timeout=5) {
	this.push("info", message, timeout);
    }

    success(message, timeout=5) {
	this.push("success", message, timeout);
    }

    alert(message, timeout=5) {
	this.push("alert", message, timeout);
    }
}
