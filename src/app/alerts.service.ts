import { Injectable, Inject, forwardRef, Output, EventEmitter } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';

import { Observable } from 'rxjs/Observable';
import { User } from './user.model';
import { AuthService } from './auth.service';
import { HttpServiceError } from './http-service-error.class'
import { Backend } from './backend.class'
import { BackgroundService } from './background.service';

@Injectable()
export class AlertsService {
    @Output() cacheTimeout = new EventEmitter();

    private alertsListObservable = null;
    private cacheTimestamp = 0;
    private cacheDuration = 1 * 60;
    private timerId = -1;

    constructor (private http: Http,
		 private authService: AuthService,
		 private httpServiceError: HttpServiceError,
		 private backend: Backend,
		 @Inject(forwardRef(()  => BackgroundService)) private backgroundService: BackgroundService
		) {}

    private url = "/alerts/";
    
    getAlertsList(): Observable<any> {
	this.checkCacheTimestamp();
	if (this.alertsListObservable === null) {
	    var headers = new Headers();
	    headers.append('Content-Type', 'application/json');
	    headers.append('Accept', 'application/json');
	    headers.append('Authorization', 'Basic ' + this.authService.getBasicAuth());

	    this.alertsListObservable = this.http.get(this.backend.getHost() + this.url, new RequestOptions({ headers: headers }))
		.cache()
		.map((data) => data.json())
		.catch(this.httpServiceError.handleError).do(() => this.updateCacheTimestamp());
	}
	return this.alertsListObservable;
    }


    markRead(id): Observable<any> {

	    var headers = new Headers();
	    headers.append('Content-Type', 'application/json');
	    headers.append('Accept', 'application/json');
	    headers.append('Authorization', 'Basic ' + this.authService.getBasicAuth());

	return this.alertsListObservable = this.http.get(this.backend.getHost() + this.url + id + "/mark_read/", new RequestOptions({ headers: headers })).cache()
		.catch(this.httpServiceError.handleError)
		    }

    markUnread(id): Observable<any> {

	    var headers = new Headers();
	    headers.append('Content-Type', 'application/json');
	    headers.append('Accept', 'application/json');
	    headers.append('Authorization', 'Basic ' + this.authService.getBasicAuth());

	return this.alertsListObservable = this.http.get(this.backend.getHost() + this.url + id + "/mark_unread/", new RequestOptions({ headers: headers })).cache()
		.catch(this.httpServiceError.handleError)
    }


    getAlertsDetail(id): Observable<any> {
	var headers = new Headers();
	headers.append('Content-Type', 'application/json');
	headers.append('Accept', 'application/json');
	headers.append('Authorization', 'Basic ' + this.authService.getBasicAuth()); 
	return this.http.get(this.backend.getHost() + this.url + id + "/", new RequestOptions({ headers: headers }))
	    .map((data) => data.json()).catch(this.httpServiceError.handleError)
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


}
