import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';

import { Observable } from 'rxjs/Observable';
import { User } from './user.model';
import { AuthService } from './auth.service';
import { HttpServiceError } from './http-service-error.class'
import { Backend } from './backend.class'

@Injectable()
export class AlertsService {

    private alertsListObservable = null;

    constructor (private http: Http,
		 private authService: AuthService,
		 private httpServiceError: HttpServiceError,
		 private backend: Backend
		) {}

    private url = "/alerts/";
    
    getAlertsList(): Observable<any> {
	console.log(this.alertsListObservable);
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

    getAlertsDetail(id): Observable<any> {
	var headers = new Headers();
	headers.append('Content-Type', 'application/json');
	headers.append('Accept', 'application/json');
	headers.append('Authorization', 'Basic ' + this.authService.getBasicAuth()); 
	return this.http.get(this.backend.getHost() + this.url + id + "/", new RequestOptions({ headers: headers }))
	    .map((data) => data.json()).catch(this.httpServiceError.handleError)
    }

}
