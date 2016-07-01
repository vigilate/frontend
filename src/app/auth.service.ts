import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';

import { Observable } from 'rxjs/Observable';
import { User } from './user.model';
import { HttpServiceError } from './http-service-error.class'
import { Backend } from './backend.class'

@Injectable()
export class AuthService {
    isLoggedIn: boolean = false;
    user: User;
    basicAuthValue;
    
    constructor (private http: Http,
		 private httpServiceError: HttpServiceError,
		 private backend: Backend
		) {}

    private url = "/users/";
    
    login(user, pwd): Observable<User> {
	this.basicAuthValue = btoa(user + ':' + pwd);
	var headers = new Headers();
	headers.append('Content-Type', 'application/json');
	headers.append('Accept', 'application/json');
	headers.append('Authorization', 'Basic ' + this.basicAuthValue); 
	return this.http.get(this.backend.getHost() + this.url, new RequestOptions({ headers: headers }))
	    .do(data => {
		this.isLoggedIn = data.ok;
	    } ).map((data) => data.json()).catch(this.httpServiceError.handleError).do((data) => {
		if (this.isLoggedIn)
		    this.user = data;
	    })
		}

    logout() {
	this.isLoggedIn = false;
	this.user = undefined;
	this.basicAuthValue = "";
    }

    signin(user, pwd): Observable<User> {
	var headers = new Headers();
	var body = JSON.stringify({ username: user, password:pwd, contrat:0, email:user+"@"+user+".com", id_dealer:0, user_type:0 });
	headers.append('Content-Type', 'application/json');
	headers.append('Accept', 'application/json');
	return this.http.post(this.backend.getHost() + this.url, body, new RequestOptions({ headers: headers }))
	    .map((data) => data.json()).catch(this.httpServiceError.handleError).do(data => {
		this.user = data;

	    })
    }

    getBasicAuth() {
	return this.basicAuthValue;
    }
}
