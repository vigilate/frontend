import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { User } from './user.model';
import { HttpServiceError } from './http-service-error.class'
import { Backend } from './backend.class'

@Injectable()
export class AuthService {
    checkLoggedObservable: Observable<boolean> = null;
    isLoggedIn: boolean = false;
    isChecking: boolean = false;
    token = localStorage.getItem("token");
    
    constructor (private http: Http,
		 private httpServiceError: HttpServiceError,
		 private backend: Backend) {}

    private url = "/sessions/";

    checkToken() {
	if (!this.isChecking || this.checkLoggedObservable != null) {
	    this.isChecking = true;
	    console.log("Checking token");
	    var headers = new Headers();
	    headers.append('Content-Type', 'application/json');
	    headers.append('Accept', 'application/json');
	    headers.append('Authorization', 'token ' + this.token);

	    this.checkLoggedObservable = Observable.create(observer => {
		this.http.get(this.backend.getHost() + this.url, new RequestOptions({ headers: headers }))
		    .catch(this.httpServiceError.handleError).cache().subscribe(
			data => {
			    this.isLoggedIn = data.ok;
			    observer.next(data.ok);
			    this.isChecking = false;
			},
			err => {
			    this.isLoggedIn = false;
			    observer.next(false);
			    this.isChecking = false;
			}
		    );
	    });
	}
	return this.checkLoggedObservable;
    }
    
    login(user, pwd): Observable<User> {

	var headers = new Headers();
	var body = JSON.stringify({ email:user, password:pwd });
	headers.append('Content-Type', 'application/json');
	headers.append('Accept', 'application/json');
	
	return this.http.post(this.backend.getHost() + this.url, body, new RequestOptions({ headers: headers }))
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
	this.isLoggedIn = false;
	this.token = "";
	localStorage.setItem("token", "");
    }

    signin(email, pwd): Observable<User> {
	var headers = new Headers();
	var body = JSON.stringify({ email:email, password:pwd });
	headers.append('Content-Type', 'application/json');
	headers.append('Accept', 'application/json');
	return this.http.post(this.backend.getHost() + this.url, body, new RequestOptions({ headers: headers }))
	    .map(data => data.json())
	    .catch(this.httpServiceError.handleError);
    }

    getToken() {
	return this.token;
    }
}
