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

    pageLoading = true;
    loadingSubmit = false;
    stations = []
    stations_dic = {}
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
	this.pageLoading = true;
	this.stationsService.getStationsList()
            .subscribe(
                stations => {
		    for (let st of stations)
			this.stations_dic[st.id] = st.name;
		    this.stations = stations;
		    this.pageLoading = false;
		},
                error =>  {
		    this.pageLoading = false;
		    if (error == "NeedToReconnect")
			throw error;
		    console.log(error);
		});
    }

    onClick(id) {
	this.router.navigate(['/stations', id]);
    }

    onDelete(id) {
	let ret = window.confirm("The station '" + this.stations_dic[id] + "' and all the programs linked to it will be deleted.");
	if (!ret)
	    return;
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

    onDownload(id, name) {
	this.api.get("/get_scanner/" + id + "/", false).subscribe(
	    data => {
		console.log(data);
		let type = 'application/text';
		if (data.headers.has("Content-Type"))
		    type = data.headers.get("Content-Type");
		let blob = new Blob([data.text()], {type: type});
		window["saveAs"](blob, "scanner-" + this.sanitizedName(name) + "_" + id + ".py");
	    });
    }

    sanitizedName(name) {
	return name.replace(/[^a-z0-9]/gi, '_').toLowerCase();
    }
}
