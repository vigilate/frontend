import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { HttpServiceError } from './http-service-error.class'
import { Api } from './api.service';

@Injectable()
export class PlansService {

    private plansListObservable = null;

    constructor (private httpServiceError: HttpServiceError,
		 private api: Api
		) {}

    private url = "/plans/";

    getPlansList(): Observable<any> {
	if (this.plansListObservable === null) {
	    this.plansListObservable = this.api.get(this.url)
		.cache()
		.map(data => data.json())
		.catch(this.httpServiceError.handleError);
	}
	return this.plansListObservable;
    }

    discardCache() {
	this.plansListObservable = null;
    }
}
