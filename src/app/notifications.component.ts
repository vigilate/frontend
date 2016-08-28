import { Component, OnInit } from '@angular/core';
import { NotificationsService } from './notifications.service'

@Component({
    selector: 'notifications',
    templateUrl: 'app/notifications.component.html'
})

export class NotificationsComponent implements OnInit {

    notifications = []


    constructor (private notificationsService: NotificationsService){}

    ngOnInit() {

	this.notificationsService.eventNew.subscribe(
	    notif => {
		this.notifications.push(notif);
	    });

	this.notificationsService.eventExpired.subscribe(
	    id => {
		let idx_slice = -1;
		for (let i = 0 ; i < this.notifications.length ; i++) {
		    if (this.notifications[i].id == id) {
			this.notifications[i].expiring = true;
			break;
		    }
		}
		setTimeout(() => {this.deleteItem(id)}, 1000);
	    });
    }

	deleteItem(id) {
	    let idx_slice = -1;
	    for (let i = 0 ; i < this.notifications.length ; i++) {
		if (this.notifications[i].id == id) {
		    idx_slice = i;
		    break;
		}
	    }
	    if (idx_slice != -1) {
		let tmp = this.notifications.slice(0, idx_slice);
		tmp = tmp.concat(this.notifications.slice(idx_slice + 1));
		this.notifications = tmp;
	    }
	}
}
