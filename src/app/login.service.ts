import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';

import { Observable } from 'rxjs/Observable';

@Injectable()
export class LoginService {
    constructor (private http: Http) {}

    private url = "http://127.0.0.1:4242/users/";
    
    getLogin(user, pwd): Observable<any> {
	var headers = new Headers();
	headers.append('Content-Type', 'application/json');
	return this.http.get(this.url, new RequestOptions({ headers: headers }))
    }
}
