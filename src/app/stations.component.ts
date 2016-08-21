import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { User } from './user.model';
import { AuthService } from './auth.service';
import { StationsService } from './stations.service';
import {PaginatePipe, PaginationControlsCmp, PaginationService} from 'ng2-pagination/dist/ng2-pagination';
import { Api } from './api.service';

@Component({
    selector: 'stations',
    templateUrl: 'app/stations.component.html',
    pipes: [PaginatePipe],
    providers: [PaginationService]
})

export class StationsComponent implements OnInit {

    loadingSubmit = false;
    stations = []
    new_station_name = "";
    
    constructor (private authService: AuthService,
		 private stationsService: StationsService,
		 private router: Router,
		 private api: Api
		){}

    ngOnInit() {
	this.reloadList();

    }

    reloadList() {
    this.stationsService.getStationsList()
            .subscribe(
                stations => {
		    this.stations = stations;
			},
                error =>  {
		    if (error == "NeedToReconnect")
			throw error;
		    console.log(error);
		});
    }
    
    onClick(id) {
    }

    onDelete(id) {
	this.stationsService.deleteStation(id)
            .subscribe(
                stations => {
		    this.stationsService.discardCache();
		    this.reloadList();
		},
                error =>  {
		    if (error == "NeedToReconnect")
			throw error;
		    console.log(error);
		});
    }

    onAddStation() {
	this.loadingSubmit = true;
	this.stationsService.createStation(this.new_station_name)
            .subscribe(
                stations => {
		    this.loadingSubmit = false;
		    this.stationsService.discardCache();
		    this.reloadList();
		},
                error =>  {
		    this.loadingSubmit = false;
		    if (error == "NeedToReconnect")
			throw error;
		    console.log(error);
		});
    }

    onDownload(id) {
	this.api.get("/get_scanner/" + id + "/", false).subscribe(
	    data => {
		console.log(data);
		let type = 'application/text';
		if (data.headers.has("Content-Type"))
		    type = data.headers.get("Content-Type");
		let blob = new Blob([data.text()], {type: type});
		window["saveAs"](blob, "scanner.py");
	    });
    }
}
