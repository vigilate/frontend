import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { User } from './user.model';
import { AlertComponent } from 'ng2-bootstrap/components/alert';
import { StationsService } from './stations.service';
import { NotificationsService } from './notifications.service'

@Component({
    selector: 'stations-detail',
    templateUrl: 'app/stations-detail.component.html',
    directives: [AlertComponent]
})

export class StationsDetailComponent implements OnInit {
    loadingSubmit = false;
    have_changes = false;
    alerts:Array<Object> = []
    station_obj = null;
    station_obj_origin = null;
    station_params = [
	{name: "Name", key: "name"}
    ]

    constructor (private router: Router,
		 private route: ActivatedRoute,
		 private stationsService: StationsService,
		 private notificationsService: NotificationsService
		){}

    ngOnInit() {
	let sub = this.route.params.subscribe(params => {
	    let id = +params['id'];
	    this.stationsService.getStationsDetail(id).subscribe(
		station => {
		    this.station_obj_origin = JSON.parse(JSON.stringify(station));
		    this.station_obj = station;
		},
		error => {
		    if (error == "NeedToReconnect")
			throw error;
		    this.stationsService.discardCache();
		    this.onGoBackList();
		}
	    );
	});
    }

    onChange(key, ev) {
	this.station_obj[key] = ev.target.value;
	this.updateHaveChange();
    }

    updateHaveChange() {
	let tmp_changes = false;
	for (var i = 0 ; i < this.station_params.length ; i++)
	{
	    let k = this.station_params[i]["key"];
	    tmp_changes = tmp_changes || (this.station_obj_origin[k] != this.station_obj[k]);
	}

	this.have_changes = tmp_changes;
    }

    onSubmit() {
	this.loadingSubmit = true;
	

	this.stationsService.updateStationDetail(this.station_obj.id, this.station_obj).subscribe(
	    station => {
		this.loadingSubmit = false;
		this.station_obj_origin = JSON.parse(JSON.stringify(station))
		this.updateHaveChange();
		this.notificationsService.info("Changes submited");
	    },
	    error => {
		this.loadingSubmit = false;
		if (error == "NeedToReconnect")
		    throw error;
		this.alerts.push({msg: error.msg, type: 'danger'});
	    }
	);

    }
    
    onGoBackList() {
	this.router.navigate(['/stations']);
    }
}
