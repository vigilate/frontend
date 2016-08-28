import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { User } from './user.model';
import { UserService } from './user.service';
import { HttpServiceError } from './http-service-error.class'
import { Api } from './api.service';
import { ProgramsService } from './programs.service';
import { BackgroundService } from './background.service';

@Injectable()
export class StationsService {

    private stationsListObservable = null;

    constructor (private userService: UserService,
		 private httpServiceError: HttpServiceError,
		 private api: Api,
		 private programsService: ProgramsService,
		 private backgroundService: BackgroundService
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

    getStationsDetail(id): Observable<any> {
	return this.api.get(this.url + id + "/")
	    .map(data => data.json())
	    .catch(this.httpServiceError.handleError);
    }

    updateStationDetail(id, obj): Observable<any> {
	var body = JSON.stringify(obj);

	this.discardCache();
	return this.api.patch(this.url + id + "/", body)
	    .map(data => data.json())
	    .catch(this.httpServiceError.handleError);
    }
    
    createStation(name): Observable<any> {
	var body = JSON.stringify({ name:name, user:this.userService.user.id });

	return this.api.post(this.url, body)
	    .map(data => data.json())
	    .do(() => {
		this.programsService.discardCache()
	    })
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
	this.backgroundService.update();
    }
}
