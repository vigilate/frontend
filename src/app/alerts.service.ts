import { Injectable, Inject, forwardRef } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';

import { Observable } from 'rxjs/Observable';
import { User } from './user.model';
import { AuthService } from './auth.service';
import { HttpServiceError } from './http-service-error.class'
import { Backend } from './backend.class'
import { BackgroundService } from './background.service';

@Injectable()
export class AlertsService {

    private alertsListObservable = null;

    constructor (private http: Http,
		 private authService: AuthService,
		 private httpServiceError: HttpServiceError,
		 private backend: Backend,
		 @Inject(forwardRef(()  => BackgroundService)) private backgroundService: BackgroundService
		) {}

    private url = "/alerts/";
    
    getAlertsList(): Observable<any> {
	if (this.alertsListObservable === null) {
	    var headers = new Headers();
	    headers.append('Content-Type', 'application/json');
	    headers.append('Accept', 'application/json');
	    headers.append('Authorization', 'Basic ' + this.authService.getBasicAuth());

	    this.alertsListObservable = this.http.get(this.backend.getHost() + this.url, new RequestOptions({ headers: headers })).cache()
		.map((data) => data.json()).catch(this.httpServiceError.handleError)
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
	this.alertsListObservable = null;
	this.backgroundService.update();
    }


}
