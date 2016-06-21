import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';

import { Observable } from 'rxjs/Observable';
import { User } from './user.model';

@Injectable()
export class AuthService {
    isLoggedIn: boolean = false;
    user: User;
    basicAuthValue;
    
    constructor (private http: Http) {}

    private url = "http://172.16.67.131/api/users/";
    
    login(user, pwd): Observable<User> {
	this.basicAuthValue = btoa(user + ':' + pwd);
	var headers = new Headers();
	headers.append('Content-Type', 'application/json');
	headers.append('Accept', 'application/json');
	headers.append('Authorization', 'Basic ' + this.basicAuthValue); 
	return this.http.get(this.url, new RequestOptions({ headers: headers }))
	    .do(data => {
		this.isLoggedIn = data.ok;
	    } ).map((data) => data.json()).catch(this.handleError).do((data) => {
		if (this.isLoggedIn)
		    this.user = data;
	    })
    }

    signin(user, pwd): Observable<User> {
	var headers = new Headers();
	var body = JSON.stringify({ username: user, password:pwd, contrat:0, email:"e", id_dealer:0, user_type:0 });
	headers.append('Content-Type', 'application/json');
	headers.append('Accept', 'application/json');
	return this.http.post(this.url, body, new RequestOptions({ headers: headers }))
	    .map((data) => data.json()).catch(this.handleError).do(data => {
		this.user = data;

	    })
    }

    private handleError (error: any) {
	try {

	    let j = JSON.parse(error._body);
	    return Observable.throw(j["detail"]);
	}
	catch (exp) {
	    console.log(exp);
	}
	let errMsg = (error.message) ? error.message :
	    error.status ? `${error.status} - ${error.statusText}` : 'Server error';

	return Observable.throw(errMsg);
    }

    getBasicAuth() {
	return this.basicAuthValue;
    }
}
