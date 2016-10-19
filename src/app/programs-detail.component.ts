import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { User } from './user.model';
import { UserService } from './user.service';
import { ProgramsService } from './programs.service';
import { StationsService } from './stations.service';
import { FormBuilder, Validators, Control, ControlGroup, FORM_DIRECTIVES } from '@angular/common';
import { NotificationsService } from './notifications.service'

@Component({
    selector: 'programs-detail',
    templateUrl: 'app/programs-detail.component.html',
    directives: [FORM_DIRECTIVES]
})

export class ProgramsDetailComponent implements OnInit {

    loadingSubmit = false;
    alerts:Array<Object> = []
    have_changes = false;
    program_params = [
	{name: "Name", key: "program_name"},
	{name: "Version", key: "program_version"}
    ]
    program_obj_origin;
    program_obj;
    creating_new = false;

    stations = []
    selectedStation = -1;
    station_new_name = "";

    alert_custom_origin = {
	def: true,
	sms: {score: 0, activated: false},
	mail: {score: 0, activated: false},
    }

    clicked = false;
    ctrl = {
	form: null,
	program_name: null,
	program_version: null,
    }
    error_field = {}

    alert_custom;
    
    constructor (private userService: UserService,
		 private programsService: ProgramsService,
		 private router: Router,
		 private route: ActivatedRoute,
		 private stationsService: StationsService,
		 private builder: FormBuilder,
		 private notificationsService: NotificationsService
		){}

    ngOnInit() {
	this.ctrl.program_name = new Control("", Validators.required);
	this.ctrl.program_version = new Control("", Validators.required);
	this.ctrl.form = this.builder.group({
	    program_name:  this.ctrl.program_name,
	    program_version:  this.ctrl.program_version
	});
	
	let sub = this.route.params.subscribe(params => {
	    if (params['id'] != "new") {
		let id = +params['id'];
		this.programsService.getProgramsDetail(id).subscribe(
		    program => {
			this.program_obj_origin = JSON.parse(JSON.stringify(program))
			this.program_obj = program;
			this.initAlertCustomFromData(this.program_obj_origin, this.alert_custom_origin);
			this.alert_custom = JSON.parse(JSON.stringify(this.alert_custom_origin));
			this.selectedStation = this.program_obj["poste"];
			this.ctrl.program_name.updateValue(this.program_obj.program_name);
			this.ctrl.program_version.updateValue(this.program_obj.program_version);
		    },
		    error => {
			if (error == "NeedToReconnect")
			    throw error;
			this.programsService.discardCache();
			this.onGoBackList();
		    }
		);
		this.reloadStations()
		
	    }
	    else {
		this.creating_new = true;
		this.program_obj_origin = {"program_name":"", "program_version":"",
					   "minimum_score":"", "user":this.userService.user
					   .id,
					   "alert_type_default": true, "email_score": 0,
					   "sms_score": 0, "email_enabled": true,
					   "sms_enabled": true, "poste": 0
					  };
		this.program_obj = JSON.parse(JSON.stringify(this.program_obj_origin));
		this.initAlertCustomFromData(this.program_obj_origin, this.alert_custom_origin);
		this.alert_custom = JSON.parse(JSON.stringify(this.alert_custom_origin));
		this.reloadStations()
		this.selectedStation = -1;
	    }
	});
	
    }

    reloadStations() {
	this.stationsService.getStationsList().subscribe(
	    stations => {
		this.stations = [{"id":-1, "name": "Create new station"}]
		this.stations = this.stations.concat(stations)
		this.selectedStation = this.stations[this.stations.length - 1].id;
	    },
	    error => {
		if (error == "NeedToReconnect")
		    throw error;
	    }
	);
    }
    onChange(key, ev) {
	this.program_obj[key] = ev.target.value;
	this.updateHaveChange();
    }

    updateHaveChange() {
	let tmp_changes = false;
	for (var i = 0 ; i < this.program_params.length ; i++)
	{
	    let k = this.program_params[i]["key"];
	    tmp_changes = tmp_changes || (this.program_obj_origin[k] != this.program_obj[k]);
	}

	tmp_changes = tmp_changes || (this.program_obj_origin.poste != this.selectedStation)

	tmp_changes = tmp_changes || (this.alert_custom_origin.def != this.alert_custom.def)
	
	tmp_changes = tmp_changes || (this.alert_custom_origin.sms.activated != this.alert_custom.sms.activated)
	tmp_changes = tmp_changes || (this.alert_custom_origin.mail.activated != this.alert_custom.mail.activated)

	tmp_changes = tmp_changes || (this.alert_custom_origin.sms.score != this.alert_custom.sms.score)
	tmp_changes = tmp_changes || (this.alert_custom_origin.mail.score != this.alert_custom.mail.score)

	this.have_changes = tmp_changes;
    }

    delayedUpdateHaveChange() {
	setTimeout(() => this.updateHaveChange(), 100);
    }

    onSubmit() {
	this.error_field = {}
	this.clicked = true;
	let station_valid = true;
	if (this.selectedStation == -1 && this.station_new_name == "") {
	    this.error_field["name"] = "If you create a new station, it is required to give it a name."
	    station_valid = false;
	}
	if (!this.ctrl.form.valid || !station_valid)
	    return;
	this.loadingSubmit = true;
	if (this.selectedStation == -1)
	{
	    this.stationsService.createStation(this.station_new_name).subscribe(
		station => {
		    this.stationsService.discardCache()
		    this.reloadStations()
		    this.selectedStation = station.id;
		    this.onSubmit();
		},
		error => {
		    if (error == "NeedToReconnect")
			throw error;
		    if (error.json) {
			for (let f in error.json) {
			    this.error_field[f] = error.json[f].join(" ");
			}
		    }
		}
	    );
	    return
	}
	
	this.program_obj.alert_type_default = this.alert_custom.def;
	this.program_obj.sms_score = this.alert_custom.sms.score;
	this.program_obj.email_score = this.alert_custom.mail.score;
	this.program_obj.sms_enabled = this.alert_custom.sms.activated;
	this.program_obj.email_enabled = this.alert_custom.mail.activated;

	this.program_obj.poste = this.selectedStation
	
	if (this.creating_new)	{
	    let tmp_prog_obj = this.program_obj;
	    tmp_prog_obj.program_version = [tmp_prog_obj.program_version];
	    this.programsService.createProgram(tmp_prog_obj).subscribe(
		program => {
		    this.loadingSubmit = false;
		    this.router.navigate(['/programs']);
		},
		error => {
		    this.loadingSubmit = false;
		    if (error == "NeedToReconnect")
			throw error;
		    if (error.json) {
			for (let f in error.json) {
			    this.error_field[f] = error.json[f].join(" ");
			}
		    }
		}
	    );
	}
	else {
	    let tmp_prog_obj = this.program_obj;
	    tmp_prog_obj.program_version = [tmp_prog_obj.program_version];
	    this.programsService.updateProgramsDetail(this.program_obj.id, tmp_prog_obj).subscribe(
		program => {
		    this.loadingSubmit = false;
		    this.program_obj_origin = JSON.parse(JSON.stringify(program))
		    this.initAlertCustomFromData(this.program_obj_origin, this.alert_custom_origin);
		    this.alert_custom = JSON.parse(JSON.stringify(this.alert_custom_origin));
		    
		    this.updateHaveChange();
		    this.notificationsService.info("Changes submited");
		},
		error => {
		    this.loadingSubmit = false;
		    if (error == "NeedToReconnect")
			throw error;
		    if (error.json) {
			for (let f in error.json) {
			    this.error_field[f] = error.json[f].join(" ");
			}
		    }
		    if (error.code == 404) {
			this.notificationsService.alert("This program has been deleted and can't be updated anymore.");
			this.stationsService.discardCache();
			this.onGoBackList();
		    }
		}
	    );
	}
    }

    initAlertCustomFromData(prog_data, alert_data) {
	alert_data.def = prog_data.alert_type_default;

	alert_data.sms.score = prog_data.sms_score;
	alert_data.mail.score = prog_data.email_score;

	alert_data.sms.activated = prog_data.sms_enabled;
	alert_data.mail.activated = prog_data.email_enabled;

    }

    onGoBackList() {
	this.router.navigate(['/programs']);
    }
}
