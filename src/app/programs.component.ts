import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { User } from './user.model';
import { ProgramsService } from './programs.service';
import { AlertComponent } from 'ng2-bootstrap/components/alert';
import { PaginatePipe, PaginationControlsCmp, PaginationService } from 'ng2-pagination/dist/ng2-pagination';
import { StorageService } from './storage.service'
import { StationsService } from './stations.service';
import { StationPipe } from './station.pipe';

@Component({
    selector: 'programs',
    templateUrl: 'app/programs.component.html',
    directives: [AlertComponent, PaginationControlsCmp],
    pipes: [PaginatePipe, StationPipe],
    providers: [PaginationService]
})

export class ProgramsComponent implements OnInit {

    cacheSubscription = null;
    alerts:Array<Object> = []
    progs = []
    stations_list = []
    stations = {}
    filtered_station = 'all';
    p = 0;
    
    constructor (private programsService: ProgramsService,
		 private router: Router,
		 private storageService: StorageService,
		 private stationsService: StationsService
		){}

    ngOnInit() {
	this.p = this.storageService.get("ProgramsComponent", "page", 1);
	this.updateList();

	this.cacheSubscription = this.programsService.cacheTimeout.subscribe(
	    () => {
		this.updateList();
	    }
	);

    }

    ngOnDestroy() {
	if (this.cacheSubscription)
	    this.cacheSubscription.unsubscribe();
    }

    updateList() {
	this.stationsService.getStationsList().subscribe(stations => {
	    this.stations_list = stations;
	    for (let st of stations)
		this.stations[st.id] = st.name;
	    this.updateListProgOnly();
	});
    }
    
    updateListProgOnly() {
	this.programsService.getProgramsList()
            .subscribe(
                programs => {
		    this.progs = programs;
			},
                error =>  {
		    if (error == "NeedToReconnect")
			throw error;
		    console.log(error);
		});
    }

    onClick(id) {
	this.router.navigate(['/programs', id]);
    }
    
    onClickDelete(id, index_array) {
	this.programsService.deleteProgram(id)
            .subscribe(
                programs => {
		    this.alerts.push({msg: "Program deleted", type: 'success'});
		    this.progs.splice(index_array, 1);
		},
                error =>  {
		    if (error == "NeedToReconnect")
			throw error;
		    this.alerts.push({msg: error.msg, type: 'danger'});
		});
    }

    onNewProgram() {
	this.router.navigate(['/programs', "new"]);
    }

    onPageChange(page) {
	this.storageService.store("ProgramsComponent", "page", page);
    }

    selectStation(st) {
	this.filtered_station = st;
    }
}
