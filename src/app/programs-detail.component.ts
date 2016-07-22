import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { User } from './user.model';
import { AuthService } from './auth.service';
import { ProgramsService } from './programs.service';
import { AlertComponent } from 'ng2-bootstrap/components/alert';
import { StationsService } from './stations.service';

@Component({
    selector: 'programs-detail',
    templateUrl: 'app/programs-detail.component.html',
    directives: [AlertComponent]
})

export class ProgramsDetailComponent implements OnInit {

    alerts:Array<Object> = []
    have_changes = false;
    program_params = [
	{name: "Name", key: "program_name"},
	{name: "Version", key: "program_version"},
	// {name: "Poste", key: "poste"}
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
	web: {score: 0, activated: false},
    }

    alert_custom;
    
    constructor (private authService: AuthService,
		 private programsService: ProgramsService,
		 private router: Router,
		 private route: ActivatedRoute,
		 private stationsService: StationsService
		){}

    ngOnInit() {

	let sub = this.route.params.subscribe(params => {
	    if (params['id'] != "new") {
		let id = +params['id'];
		this.programsService.getProgramsDetail(id).subscribe(program => {
		    this.program_obj_origin = JSON.parse(JSON.stringify(program))
		    this.program_obj = program;
		    this.initAlertCustomFromData(this.program_obj_origin, this.alert_custom_origin);
		    this.alert_custom = JSON.parse(JSON.stringify(this.alert_custom_origin));
		    this.selectedStation = this.program_obj["poste"];
		});
		this.reloadStations()
		
	    }
	    else {
		this.creating_new = true;
		this.program_obj_origin = {"program_name":"", "program_version":"",
					   "minimum_score":"", "user_id":this.authService.user[0].id,
					   "alert_type_default": true, "email_score": 0,
					   "sms_score": 0, "web_score": 0, "email_enabled": true,
					   "sms_enabled": true, "web_enabled": true, "poste": 0
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
	this.stationsService.getStationsList().subscribe(stations => {
	    this.stations = [{"id":-1, "name": "Create new station"}]
	    this.stations = this.stations.concat(stations)
	});
    }
    onChange(key, ev) {
	this.program_obj[key] = ev.target.value;
	this.updateHaveChange();
    }

    updateHaveChange() {
	console.log("bla");
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
	tmp_changes = tmp_changes || (this.alert_custom_origin.web.activated != this.alert_custom.web.activated)

	tmp_changes = tmp_changes || (this.alert_custom_origin.sms.score != this.alert_custom.sms.score)
	tmp_changes = tmp_changes || (this.alert_custom_origin.mail.score != this.alert_custom.mail.score)
	tmp_changes = tmp_changes || (this.alert_custom_origin.web.score != this.alert_custom.web.score)

	this.have_changes = tmp_changes;
    }

    delayedUpdateHaveChange() {
	setTimeout(() => this.updateHaveChange(), 100);
    }

    onSubmit() {
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
		    this.alerts.push({msg: error, type: 'danger'});
		}
	    );
	    return
	}
	
	this.program_obj.alert_type_default = this.alert_custom.def;
	this.program_obj.sms_score = this.alert_custom.sms.score;
	this.program_obj.email_score = this.alert_custom.mail.score;
	this.program_obj.web_score = this.alert_custom.web.score;
	this.program_obj.sms_enabled = this.alert_custom.sms.activated;
	this.program_obj.email_enabled = this.alert_custom.mail.activated;
	this.program_obj.web_enabled = this.alert_custom.web.activated;

	this.program_obj.poste = this.selectedStation
	
	if (this.creating_new)	{
	    this.programsService.createProgram(this.program_obj).subscribe(
		program => {
		    this.router.navigate(['/programs']);
		},
		error => {
		    this.alerts.push({msg: error, type: 'danger'});
		}
	    );
	}
	else {
	    this.programsService.updateProgramsDetail(this.program_obj.id, this.program_obj).subscribe(
		program => {
		    this.program_obj_origin = JSON.parse(JSON.stringify(program))
		    this.initAlertCustomFromData(this.program_obj_origin, this.alert_custom_origin);
		    this.alert_custom = JSON.parse(JSON.stringify(this.alert_custom_origin));
		    
		    this.updateHaveChange();
		    this.alerts.push({msg: "Changes submited", type: 'success'});
		},
		error => {
		    this.alerts.push({msg: error, type: 'danger'});
		}
	    );
	}
    }

    initAlertCustomFromData(prog_data, alert_data) {
	alert_data.def = prog_data.alert_type_default;

	alert_data.sms.score = prog_data.sms_score;
	alert_data.mail.score = prog_data.email_score;
	alert_data.web.score = prog_data.web_score;

	alert_data.sms.activated = prog_data.sms_enabled;
	alert_data.mail.activated = prog_data.email_enabled;
	alert_data.web.activated = prog_data.web_enabled;

    }

    onGoBackList() {
	this.router.navigate(['/programs']);
    }
}
