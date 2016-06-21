import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';

import { Observable } from 'rxjs/Observable';
import { User } from './user.model';
import { AuthService } from './auth.service';

@Injectable()
export class ProgramsService {
   
    constructor (private http: Http, private authService: AuthService) {}

    private url = "http://172.16.67.131/api/uprog/";
    
    getProgramsList(): Observable<any> {
	var headers = new Headers();
	headers.append('Content-Type', 'application/json');
	headers.append('Accept', 'application/json');
	headers.append('Authorization', 'Basic ' + this.authService.getBasicAuth()); 
	return this.http.get(this.url, new RequestOptions({ headers: headers }))
	    .map((data) => data.json()).catch(this.handleError)
    }

    getProgramsDetail(id): Observable<any> {
	var headers = new Headers();
	headers.append('Content-Type', 'application/json');
	headers.append('Accept', 'application/json');
	headers.append('Authorization', 'Basic ' + this.authService.getBasicAuth()); 
	return this.http.get(this.url + id + "/", new RequestOptions({ headers: headers }))
	    .map((data) => data.json()).catch(this.handleError)
    }

    updateProgramsDetail(id, obj): Observable<any> {
	var headers = new Headers();
	var body = JSON.stringify(obj);

	headers.append('Content-Type', 'application/json');
	headers.append('Accept', 'application/json');
	headers.append('Authorization', 'Basic ' + this.authService.getBasicAuth());

	return this.http.patch(this.url + id + "/", body, new RequestOptions({ headers: headers }))
	    .map((data) => data.json()).catch(this.handleError)
    }


    private handleError (error: any) {
	try {

	    let j = JSON.parse(error._body);
	    if ("detail" in j)
		return Observable.throw(j["detail"]);
	    else
		return Observable.throw(error._body);
	}
	catch (exp) {
	    console.log(exp);
	}
	let errMsg = (error.message) ? error.message :
	    error.status ? `${error.status} - ${error.statusText}` : 'Server error';

	return Observable.throw(errMsg);
    }
}
