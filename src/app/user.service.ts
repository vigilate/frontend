import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { User } from './user.model';
import { HttpServiceError } from './http-service-error.class'
import { Api } from './api.service'

@Injectable()
export class UserService {

    user: User = null;

    constructor (private httpServiceError: HttpServiceError,
		 private api: Api) {}

    private url = "/users/";

    getUser(): Observable<any> {
	return this.api.get(this.url)
	    .map(data => data.json())
	    .catch(this.httpServiceError.handleError).do(data => {
		this.user = data[0];
	    });
    }

    deleteAccount(): Observable<any> {
	return this.api.delete(this.url + this.user.id + "/")
	    .map(data => {
		if (!data.ok)
		    return data.json()
		return data;
	    })
	    .catch(this.httpServiceError.handleError);
    }

    updatePhoneNumber(phone): Observable<any> {
	var body = JSON.stringify({"phone": phone});

	return this.api.patch(this.url + this.user.id + "/", body)
	    .map(data => data.json())
	    .catch(this.httpServiceError.handleError);
    }

    updateInfos(infos): Observable<any> {
	var body = JSON.stringify(infos);
	return this.api.patch(this.url + this.user.id + "/", body)
	    .map(data => data.json())
	    .catch(this.httpServiceError.handleError);
    }

    getStats(): Observable<any> {
	return this.api.get(this.url + this.user.id + "/stats/")
	    .map(data => data.json())
	    .catch(this.httpServiceError.handleError);
    }
}
