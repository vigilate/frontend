import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';

import { Observable } from 'rxjs/Observable';
import { User } from './user.model';
import { AuthService } from './auth.service';
import { HttpServiceError } from './http-service-error.class'
import { Backend } from './backend.class'

@Injectable()
export class ProgramsService {

    private programListObservable = null;

    constructor (private http: Http,
		 private authService: AuthService,
		 private httpServiceError: HttpServiceError,
		 private backend: Backend
		) {}

    private url = "/uprog/";
    
    getProgramsList(): Observable<any> {
	console.log(this.programListObservable);
	if (this.programListObservable === null) {
	    var headers = new Headers();
	    headers.append('Content-Type', 'application/json');
	    headers.append('Accept', 'application/json');
	    headers.append('Authorization', 'Basic ' + this.authService.getBasicAuth()); 
	    this.programListObservable = this.http.get(this.backend.getHost() + this.url, new RequestOptions({ headers: headers })).cache()
		.map((data) => data.json()).catch(this.httpServiceError.handleError)
		    }
		return this.programListObservable;
    }

    getProgramsDetail(id): Observable<any> {
	var headers = new Headers();
	headers.append('Content-Type', 'application/json');
	headers.append('Accept', 'application/json');
	headers.append('Authorization', 'Basic ' + this.authService.getBasicAuth()); 
	return this.http.get(this.backend.getHost() + this.url + id + "/", new RequestOptions({ headers: headers }))
	    .map((data) => data.json()).catch(this.httpServiceError.handleError)
    }

    updateProgramsDetail(id, obj): Observable<any> {
	var headers = new Headers();
	var body = JSON.stringify(obj);

	headers.append('Content-Type', 'application/json');
	headers.append('Accept', 'application/json');
	headers.append('Authorization', 'Basic ' + this.authService.getBasicAuth());

	return this.http.patch(this.backend.getHost() + this.url + id + "/", body, new RequestOptions({ headers: headers }))
	    .map((data) => data.json()).catch(this.httpServiceError.handleError)
		}

    createProgram(obj): Observable<any> {
	var headers = new Headers();
	var body = JSON.stringify(obj);

	headers.append('Content-Type', 'application/json');
	headers.append('Accept', 'application/json');
	headers.append('Authorization', 'Basic ' + this.authService.getBasicAuth());

	return this.http.post(this.backend.getHost() + this.url, body, new RequestOptions({ headers: headers }))
	    .map((data) => data.json()).catch(this.httpServiceError.handleError)
		}

    deleteProgram(id): Observable<any> {
	var headers = new Headers();
	headers.append('Content-Type', 'application/json');
	headers.append('Accept', 'application/json');
	headers.append('Authorization', 'Basic ' + this.authService.getBasicAuth());
	return this.http.delete(this.backend.getHost() + this.url + id + "/", new RequestOptions({ headers: headers }))
	    .map((data) => {
		if (!data.ok)
		    return data.json()
		return data;
	    })
	    .catch(this.httpServiceError.handleError)
	}
}
