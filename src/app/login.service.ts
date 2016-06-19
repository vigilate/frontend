import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';

import { Observable } from 'rxjs/Observable';
import { User } from './user.model';

@Injectable()
export class LoginService {
    constructor (private http: Http) {}

    //private url = "http://127.0.0.1:4242/users/";
    private url = "http://172.16.67.131/api/users/";
    
    getLogin(user, pwd): Observable<User> {
	var headers = new Headers();
	headers.append('Content-Type', 'application/json');
	headers.append('Accept', 'application/json');
	headers.append('Authorization', 'Basic ' + btoa(user + ':' + pwd)); 
	return this.http.get(this.url, new RequestOptions({ headers: headers }))
	    .map((data) => data.json()).catch(this.handleError)
	
    }

    private handleError (error: any) {
	let errMsg = (error.message) ? error.message :
	    error.status ? `${error.status} - ${error.statusText}` : 'Server error';
	console.error(errMsg);
	return Observable.throw(errMsg);
    }
}
