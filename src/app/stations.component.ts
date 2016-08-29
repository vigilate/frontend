import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { User } from './user.model';
import { AuthService } from './auth.service';
import { StationsService } from './stations.service';
import {PaginatePipe, PaginationControlsCmp, PaginationService} from 'ng2-pagination/dist/ng2-pagination';
import { Api } from './api.service';
import { StorageService } from './storage.service'
import { FormBuilder, Validators, Control, ControlGroup, FORM_DIRECTIVES } from '@angular/common';

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

    tour_current_step = ""

    clicked = false;
    ctrl = {
	form: null,
	name: null,
    }
    error_field = {}
    
    constructor (private authService: AuthService,
		 private stationsService: StationsService,
		 private router: Router,
		 private api: Api,
		 private storageService: StorageService,
		 private builder: FormBuilder
		){}

    ngOnInit() {
	this.ctrl.name = new Control("", Validators.required);
	this.ctrl.form = this.builder.group({
	    name:  this.ctrl.name,
	});

	this.reloadList();
	let tour = this.storageService.get("Tour", "current_step", "");
	if (tour == "/stations") {
	    this.tour_current_step = "add-station";
	    this.storageService.store("Tour", "current_step", this.tour_current_step);
	}
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
		    if (error.code == 404)
			this.reloadList();
		    console.log(error);
		});
    }

    onAddStation() {
	this.error_field = {}
	this.clicked = true;
	if (!this.ctrl.form.valid)
	    return;
	this.loadingSubmit = true;
	this.stationsService.createStation(this.new_station_name)
            .subscribe(
                stations => {
		    this.loadingSubmit = false;
		    this.stationsService.discardCache();
		    this.reloadList();
		    let tour = this.storageService.get("Tour", "current_step", "");
		    if (tour == "add-station") {
			this.tour_current_step = "download-scanner";
			this.storageService.store("Tour", "current_step", this.tour_current_step);

		    }
		},
                error =>  {
		    this.loadingSubmit = false;
		    if (error == "NeedToReconnect")
			throw error;
		    if (error.json) {
			for (let f in error.json) {
			    this.error_field[f] = error.json[f].join(" ");
			}
		    }
		});
    }

    onDownload(id, name) {
	this.api.get("/get_scanner/" + id + "/", false).subscribe(
	    data => {
		let type = 'application/text';
		if (data.headers.has("Content-Type"))
		    type = data.headers.get("Content-Type");
		let blob = new Blob([data.text()], {type: type});
		window["saveAs"](blob, "scanner-" + this.sanitizedName(name) + "_" + id + ".py");

		let tour = this.storageService.get("Tour", "current_step", "");
		    if (tour == "download-scanner") {
			this.tour_current_step = "/programs";
			this.storageService.store("Tour", "current_step", this.tour_current_step);
		    }
	    },
	    error => {
		if (error == "NeedToReconnect")
		    throw error;
		if (error.code == 404)
		    this.reloadList();
	    }
	);
    }
    sanitizedName(name) {
	return name.replace(/[^a-z0-9]/gi, '_').toLowerCase();
    }

    onClickRefresh() {
	this.stationsService.discardCache();
	this.reloadList();
    }
}
