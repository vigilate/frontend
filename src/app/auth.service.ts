import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { User } from './user.model';
import { HttpServiceError } from './http-service-error.class'
import { Backend } from './backend.class'

@Injectable()
export class AuthService {
    checkLoggedObservable: Observable<any> = null;
    isLoggedIn: boolean = false;
    isChecking: boolean = false;
    token = localStorage.getItem("token");
    triedToConnect = false;
    
    constructor (private http: Http,
		 private httpServiceError: HttpServiceError,
		 private backend: Backend) {}

    private url = "/sessions/";

    checkToken() {
	this.triedToConnect = true;
	if (!this.isChecking || this.checkLoggedObservable != null) {
	    this.isChecking = true;
	    var headers = new Headers();
	    headers.append('Content-Type', 'application/json');
	    headers.append('Accept', 'application/json');
	    headers.append('Authorization', 'token ' + this.token);

	    this.checkLoggedObservable = this.http.get(this.backend.getUrl() + this.url, new RequestOptions({ headers: headers }))
		.do(
		    data => {
			this.isLoggedIn = data.ok;
			this.isChecking = false;
		    })
		.catch(
		    err => {
			this.isLoggedIn = false;
			this.isChecking = false;
			return this.httpServiceError.handleError(err);
		    });
	}
	return this.checkLoggedObservable;
    }
    
    login(user, pwd): Observable<User> {

	var headers = new Headers();
	var body = JSON.stringify({ email:user, password:pwd });
	headers.append('Content-Type', 'application/json');
	headers.append('Accept', 'application/json');
	
	return this.http.post(this.backend.getUrl() + this.url, body, new RequestOptions({ headers: headers }))
	    .do(data => {
		this.isLoggedIn = data.ok;
	    } ).map((data) => data.json()).catch(this.httpServiceError.handleError).do((data) => {
		if (this.isLoggedIn) {
		    this.token = data.token;
		    localStorage.setItem("token", this.token);

		}
	    });
    }

    logout() {
	localStorage.setItem("token", "");
	var headers = new Headers();
	headers.append('Content-Type', 'application/json');
	headers.append('Accept', 'application/json');
	headers.append('Authorization', 'token ' + this.token);

	return this.http.delete(this.backend.getUrl() + this.url + "/" + this.token + "/", new RequestOptions({ headers: headers }))
	    .do(() => {
		this.isLoggedIn = false;
		this.token = "";
	    })
		.catch(this.httpServiceError.handleError);
    }

    signin(email, pwd): Observable<User> {
	var headers = new Headers();
	var body = JSON.stringify({ email:email, password:pwd });
	headers.append('Content-Type', 'application/json');
	headers.append('Accept', 'application/json');
	return this.http.post(this.backend.getUrl() + "/users/", body, new RequestOptions({ headers: headers }))
	    .map(data => data.json())
	    .catch(this.httpServiceError.handleError);
    }

    getToken() {
	return this.token;
    }
}
