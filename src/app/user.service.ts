import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';

import { Observable } from 'rxjs/Observable';
import { User } from './user.model';
import { AuthService } from './auth.service';
import { HttpServiceError } from './http-service-error.class'
import { Backend } from './backend.class'

@Injectable()
export class UserService {
   
    constructor (private http: Http,
		 private authService: AuthService,
		 private httpServiceError: HttpServiceError,
		 private backend: Backend) {}

    private url = "/users/";
    
    deleteAccount(): Observable<any> {
	var headers = new Headers();
	headers.append('Content-Type', 'application/json');
	headers.append('Accept', 'application/json');
	headers.append('Authorization', 'Basic ' + this.authService.getBasicAuth()); 
	return this.http.delete(this.backend.getHost() + this.url + this.authService.user[0].id + "/" , new RequestOptions({ headers: headers }))
	    .map((data) => {
		if (!data.ok)
		    return data.json()
		return data;
	    }).catch(this.httpServiceError.handleError).do((data) => {
	    })
    }

}
