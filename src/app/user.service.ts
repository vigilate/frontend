import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';

import { Observable } from 'rxjs/Observable';
import { User } from './user.model';
import { AuthService } from './auth.service';

@Injectable()
export class UserService {
   
    constructor (private http: Http, private authService: AuthService) {}

    private url = "http://172.16.67.131/api/users/";
    
    deleteAccount(): Observable<any> {
	var headers = new Headers();
	headers.append('Content-Type', 'application/json');
	headers.append('Accept', 'application/json');
	headers.append('Authorization', 'Basic ' + this.authService.getBasicAuth()); 
	return this.http.delete(this.url + this.authService.user[0].id + "/" , new RequestOptions({ headers: headers }))
	    .map((data) => data.json()).catch(this.handleError).do((data) => {
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
}
