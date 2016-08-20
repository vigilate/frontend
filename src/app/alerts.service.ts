import { Injectable, Inject, forwardRef, Output, EventEmitter } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { User } from './user.model';
import { HttpServiceError } from './http-service-error.class'
import { Api } from './api.service'
import { BackgroundService } from './background.service';

@Injectable()
export class AlertsService {
    @Output() cacheTimeout = new EventEmitter();

    private alertsListObservable = null;
    private cacheTimestamp = 0;
    private cacheDuration = 1 * 60;
    private timerId = -1;

    constructor (private httpServiceError: HttpServiceError,
		 private api: Api,
		 private backgroundService: BackgroundService
		) {}

    private url = "/alerts/";

    getAlertsList(): Observable<any> {
	this.checkCacheTimestamp();
	if (this.alertsListObservable === null) {
	    this.alertsListObservable = this.api.get(this.url)
		.cache()
		.map(data => data.json())
		.catch(this.httpServiceError.handleError).do(() => this.updateCacheTimestamp());
	}
	return this.alertsListObservable;
    }

    markRead(id): Observable<any> {
	return this.api.get(this.url + id + "/mark_read/")
	    .cache()
	    .catch(this.httpServiceError.handleError);
    }

    markUnread(id): Observable<any> {
	return this.api.get(this.url + id + "/mark_unread/")
	    .cache()
	    .catch(this.httpServiceError.handleError);
    }

    markAllRead(): Observable<any> {
	return this.api.get(this.url + "mark_all_read/")
	    .cache()
	    .catch(this.httpServiceError.handleError);
    }

    markAllUnread(): Observable<any> {
	return this.api.get(this.url + "mark_all_unread/")
	    .cache()
	    .catch(this.httpServiceError.handleError);
    }


    getAlertsDetail(id): Observable<any> {
	return this.api.get(this.url + id + "/")
	    .map(data => data.json())
	    .catch(this.httpServiceError.handleError);
    }

    discardCache() {
	this.cacheTimestamp = 0;
	this.backgroundService.update();
    }

    updateCacheTimestamp() {
	this.cacheTimestamp = new Date().getTime() / 1000;
	if (this.timerId != -1)
	    clearTimeout(this.timerId);

	this.timerId = setTimeout(
	    () => {
		this.checkCacheTimestamp()
	    },
	    this.cacheDuration * 1000
	);
    }

    checkCacheTimestamp() {
	let now = new Date().getTime() / 1000;
	if (now - this.cacheTimestamp >= this.cacheDuration
	    && this.alertsListObservable !== null) {
	    this.alertsListObservable = null;
	    this.cacheTimeout.emit(null)
	}
    }

    trigerEmitTimeout() {
	this.discardCache();
	this.checkCacheTimestamp();
    }
}
