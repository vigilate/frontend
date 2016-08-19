import { Injectable, Inject, forwardRef, Output, EventEmitter } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { User } from './user.model';
import { AlertsService } from './alerts.service';
import { HttpServiceError } from './http-service-error.class'
import { Api } from './api.service'
import { BackgroundService } from './background.service';

@Injectable()
export class ProgramsService {
    @Output() cacheTimeout = new EventEmitter();

    private programListObservable = null;
    private cacheTimestamp = 0;
    private cacheDuration = 1 * 60;
    private timerId = -1;

    constructor (private httpServiceError: HttpServiceError,
		 private api: Api,
		 private alertsService: AlertsService,
		 @Inject(forwardRef(()  => BackgroundService)) private backgroundService: BackgroundService
		) {}

    private url = "/uprog/";
    
    getProgramsList(): Observable<any> {
	this.checkCacheTimestamp();
	if (this.programListObservable === null) {
	    this.programListObservable = this.api.get(this.url)
		.cache()
		.map(data => data.json())
		.catch(this.httpServiceError.handleError).do(() => this.updateCacheTimestamp());
	}
	return this.programListObservable;
    }

    getProgramsDetail(id): Observable<any> {
	return this.api.get(this.url + id + "/")
	    .map(data => data.json())
	    .catch(this.httpServiceError.handleError);
    }

    updateProgramsDetail(id, obj): Observable<any> {
	var body = JSON.stringify(obj);

	this.discardCache();
	return this.api.patch(this.url + id + "/", body)
	    .map(data => data.json())
	    .catch(this.httpServiceError.handleError);
    }

    createProgram(obj): Observable<any> {
	var body = JSON.stringify(obj);

	this.discardCache();
	return this.api.post(this.url, body)
	    .map(data => data.json())
	    .catch(this.httpServiceError.handleError);
    }

    deleteProgram(id): Observable<any> {
	this.discardCache();

	return this.api.delete(this.url + id + "/")
	    .map(data => {
		if (!data.ok)
		    return data.json()
		return data;
	    })
	    .catch(this.httpServiceError.handleError);
    }

    discardCache() {
	this.cacheTimestamp = 0;
	this.alertsService.discardCache();
	this.backgroundService.update();
    }

    updateCacheTimestamp() {
	this.cacheTimestamp = new Date().getTime() / 1000;
	if (this.timerId != -1)
	    clearTimeout(this.timerId);
	this.timerId = setTimeout(
	    () => {
		this.checkCacheTimestamp()
	    },
	    this.cacheDuration * 1000
	);
    }

    checkCacheTimestamp() {
	let now = new Date().getTime() / 1000;
	if (now - this.cacheTimestamp >= this.cacheDuration
	    && this.programListObservable !== null) {
	    this.programListObservable = null;
	    this.cacheTimeout.emit(null)
	}
    }
}
