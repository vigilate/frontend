import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';

import { Observable } from 'rxjs/Observable';
import { User } from './user.model';
import { AuthService } from './auth.service';
import { HttpServiceError } from './http-service-error.class'
import { Backend } from './backend.class'
import { ProgramsService } from './programs.service';

@Injectable()
export class StationsService {

    private stationsListObservable = null;

    constructor (private http: Http,
		 private authService: AuthService,
		 private httpServiceError: HttpServiceError,
		 private backend: Backend,
		 private programsService: ProgramsService
		) {}

    private url = "/stations/";
    
    getStationsList(): Observable<any> {
	if (this.stationsListObservable === null) {
	    var headers = new Headers();
	    headers.append('Content-Type', 'application/json');
	    headers.append('Accept', 'application/json');
	    headers.append('Authorization', 'Basic ' + this.authService.getBasicAuth());

	    this.stationsListObservable = this.http.get(this.backend.getHost() + this.url, new RequestOptions({ headers: headers })).cache()
		.map((data) => data.json()).catch(this.httpServiceError.handleError)
		    }
		return this.stationsListObservable;
    }


    createStation(name): Observable<any> {
	var headers = new Headers();
	var body = JSON.stringify({ name:name, user:this.authService.user[0].id });
	headers.append('Content-Type', 'application/json');
	headers.append('Accept', 'application/json');
	headers.append('Authorization', 'Basic ' + this.authService.getBasicAuth());

	return this.http.post(this.backend.getHost() + this.url, body, new RequestOptions({ headers: headers }))
	    .map((data) => data.json()).catch(this.httpServiceError.handleError)
		}


    deleteStation(id): Observable<any> {
	var headers = new Headers();
	headers.append('Content-Type', 'application/json');
	headers.append('Accept', 'application/json');
	headers.append('Authorization', 'Basic ' + this.authService.getBasicAuth());
	return this.http.delete(this.backend.getHost() + this.url + id + "/", new RequestOptions({ headers: headers }))
	    .map((data) => {data.json(); this.programsService.discardCache()}).catch(this.httpServiceError.handleError)
		}


    discardCache() {
	this.stationsListObservable = null;
    }

}
