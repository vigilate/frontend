import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { User } from './user.model';
import { AuthService } from './auth.service';
import { StationsService } from './stations.service';
import {PaginatePipe, PaginationControlsCmp, PaginationService} from 'ng2-pagination/dist/ng2-pagination';

@Component({
    selector: 'stations',
    templateUrl: 'app/stations.component.html',
    pipes: [PaginatePipe],
    providers: [StationsService, PaginationService]
})

export class StationsComponent implements OnInit {
    stations = []
    new_station_name = "";
    
    constructor (private authService: AuthService,
		 private stationsService: StationsService,
		 private router: Router
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
		    console.log(error);
		});
    }

    onAddStation() {
	this.stationsService.createStation(this.new_station_name)
            .subscribe(
                stations => {
		    this.stationsService.discardCache();
		    this.reloadList();
		},
                error =>  {
		    console.log(error);
		});
    }

}
