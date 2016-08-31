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
    
    get(url, with_api_path=true) {
	let dest;
	if (with_api_path)
	    dest = this.backend.getUrl() + url
	else
	    dest = this.backend.getHost() + url;
	
	return this.http.get(dest, this.generateOptions());
    }

    delete(url) {	
	return this.http.delete(this.backend.getUrl() + url, this.generateOptions());
    }
    
    post(url, body, with_api_path=true) {
	let dest;
	if (with_api_path)
	    dest = this.backend.getUrl() + url
	else
	    dest = this.backend.getHost() + url;

	return this.http.post(dest, body, this.generateOptions());
    }

    patch(url, body) {
	return this.http.patch(this.backend.getUrl() + url, body, this.generateOptions());
    }
}
