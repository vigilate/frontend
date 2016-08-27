import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { User } from './user.model';
import { ProgramsService } from './programs.service';
import { AlertComponent } from 'ng2-bootstrap/components/alert';
import { PaginatePipe, PaginationControlsCmp, PaginationService } from 'ng2-pagination/dist/ng2-pagination';
import { StorageService } from './storage.service'
import { StationsService } from './stations.service';
import { StationPipe } from './station.pipe';
import { FilterPipe } from './filter.pipe';

@Component({
    selector: 'programs',
    templateUrl: 'app/programs.component.html',
    directives: [AlertComponent, PaginationControlsCmp],
    pipes: [PaginatePipe, StationPipe, FilterPipe],
    providers: [PaginationService]
})

export class ProgramsComponent implements OnInit {

    pageLoading = true;
    cacheSubscription = null;
    alerts:Array<Object> = []
    progs = []
    stations_list = []
    stations = {}
    filtered_station = 'all';
    filter = ""
    p = 0;

    filter_options = ["is:vulnerable",
		      "is!vulnerable",
		     "version:",
		     "station:"
		    ];
    
    constructor (private programsService: ProgramsService,
		 private router: Router,
		 private storageService: StorageService,
		 private stationsService: StationsService
		){}

    ngOnInit() {
	this.p = this.storageService.get("ProgramsComponent", "page", 1);
	this.updateList();

	let tour = this.storageService.get("Tour", "current_step", "");
	if (tour == "/programs") {
	    let tour_current_step = "end";
	    this.storageService.store("Tour", "current_step", tour_current_step);
	}

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
	this.pageLoading = true;
	this.stationsService.getStationsList().subscribe(
	    stations => {
		this.stations_list = stations;
		for (let st of stations)
		    this.stations[st.id] = st.name;
		this.updateListProgOnly();
	    },
	    () => {
		this.pageLoading = false;
	    }
	);
    }
    
    updateListProgOnly() {
	this.pageLoading = true;
	this.programsService.getProgramsList()
            .subscribe(
                programs => {
		    for (let i = 0 ; i < programs.length ; i++)
			programs[i].station_name = this.stations[programs[i].poste];
		    this.progs = programs;
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
	this.router.navigate(['/programs', id]);
    }
    
    onClickDelete(id, index_array) {
	this.programsService.deleteProgram(id)
            .subscribe(
                programs => {
		    this.alerts.push({msg: "Program deleted", type: 'success'});

		    index_array = index_array + (this.p - 1) * 100;
		    let tmp = this.progs.slice(0, index_array);
		    if (index_array + 1 < this.progs.length)
			tmp = tmp.concat(this.progs.slice(index_array + 1));
		    this.progs = tmp;
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

    onClickFilter(f) {
	this.filter = this.filter + " " + f;
    }

    onClickRefresh() {
	this.programsService.trigerEmitTimeout();
    }
}
