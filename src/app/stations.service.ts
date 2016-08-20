import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { User } from './user.model';
import { UserService } from './user.service';
import { HttpServiceError } from './http-service-error.class'
import { Api } from './api.service';
import { ProgramsService } from './programs.service';

@Injectable()
export class StationsService {

    private stationsListObservable = null;

    constructor (private userService: UserService,
		 private httpServiceError: HttpServiceError,
		 private api: Api,
		 private programsService: ProgramsService
		) {}

    private url = "/stations/";

    getStationsList(): Observable<any> {
	if (this.stationsListObservable === null) {
	    this.stationsListObservable = this.api.get(this.url)
		.cache()
		.map(data => data.json())
		.catch(this.httpServiceError.handleError);
	}
	return this.stationsListObservable;
    }

    createStation(name): Observable<any> {
	var body = JSON.stringify({ name:name, user:this.userService.user.id });

	return this.api.post(this.url, body)
	    .map(data => data.json())
	    .catch(this.httpServiceError.handleError);
    }

    deleteStation(id): Observable<any> {
	return this.api.delete(this.url + id + "/")
	    .do(() => {
		this.programsService.discardCache()
	    })
	    .catch(this.httpServiceError.handleError);
    }

    discardCache() {
	this.stationsListObservable = null;
    }
}
