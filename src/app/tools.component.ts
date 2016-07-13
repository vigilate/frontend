import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { User } from './user.model';
import { AuthService } from './auth.service';
import { StationsService } from './stations.service';
import {PaginatePipe, PaginationControlsCmp, PaginationService} from 'ng2-pagination/dist/ng2-pagination';

@Component({
    selector: 'tools',
    templateUrl: 'app/tools.component.html',
    pipes: [PaginatePipe],
    providers: [StationsService, PaginationService]
})

export class ToolsComponent implements OnInit {
    stations = []
    new_station_name = "";
    
    constructor (private authService: AuthService,
		 private stationsService: StationsService,
		 private router: Router
		){}

    ngOnInit() {
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
    }

    onSubmit() {
    }

}
