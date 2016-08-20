import { Injectable, Inject, forwardRef } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { AuthService } from './auth.service';
import { Backend } from './backend.class';

@Injectable()
export class Api {

    constructor (private http: Http,
		 private authService: AuthService,
		 private backend: Backend) {}
    
    generateOptions() {
	var headers = new Headers();
	headers.append('Content-Type', 'application/json');
	headers.append('Accept', 'application/json');
	if (this.authService.isLoggedIn)
	    headers.append('Authorization', 'token ' + this.authService.getToken());
	var options = new RequestOptions({ headers: headers });
	return options;
    }
    
    get(url) {	
	return this.http.get(this.backend.getHost() + url, this.generateOptions());
    }

    delete(url) {	
	return this.http.delete(this.backend.getHost() + url, this.generateOptions());
    }
    
    post(url, body) {
	return this.http.post(this.backend.getHost() + url, body, this.generateOptions());
    }

    patch(url, body) {
	return this.http.patch(this.backend.getHost() + url, body, this.generateOptions());
    }
}
