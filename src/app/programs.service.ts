import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';

import { Observable } from 'rxjs/Observable';
import { User } from './user.model';
import { AuthService } from './auth.service';
import { HttpServiceError } from './http-service-error.class'

@Injectable()
export class ProgramsService {
   
    constructor (private http: Http,
		 private authService: AuthService,
		 private httpServiceError: HttpServiceError) {}

    private url = "http://172.16.67.131/api/uprog/";
    
    getProgramsList(): Observable<any> {
	var headers = new Headers();
	headers.append('Content-Type', 'application/json');
	headers.append('Accept', 'application/json');
	headers.append('Authorization', 'Basic ' + this.authService.getBasicAuth()); 
	return this.http.get(this.url, new RequestOptions({ headers: headers }))
	    .map((data) => data.json()).catch(this.httpServiceError.handleError)
    }

    getProgramsDetail(id): Observable<any> {
	var headers = new Headers();
	headers.append('Content-Type', 'application/json');
	headers.append('Accept', 'application/json');
	headers.append('Authorization', 'Basic ' + this.authService.getBasicAuth()); 
	return this.http.get(this.url + id + "/", new RequestOptions({ headers: headers }))
	    .map((data) => data.json()).catch(this.httpServiceError.handleError)
    }

    updateProgramsDetail(id, obj): Observable<any> {
	var headers = new Headers();
	var body = JSON.stringify(obj);

	headers.append('Content-Type', 'application/json');
	headers.append('Accept', 'application/json');
	headers.append('Authorization', 'Basic ' + this.authService.getBasicAuth());

	return this.http.patch(this.url + id + "/", body, new RequestOptions({ headers: headers }))
	    .map((data) => data.json()).catch(this.httpServiceError.handleError)
    }

}
