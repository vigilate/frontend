import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { User } from './user.model';
import { AuthService } from './auth.service';
import { ProgramsService } from './programs.service';
import { AlertComponent } from 'ng2-bootstrap/components/alert';
import { PaginatePipe, PaginationControlsCmp, PaginationService } from 'ng2-pagination/dist/ng2-pagination';
import { StorageService } from './storage.service'

@Component({
    selector: 'programs',
    templateUrl: 'app/programs.component.html',
    directives: [AlertComponent, PaginationControlsCmp],
    pipes: [PaginatePipe],
    providers: [PaginationService]
})

export class ProgramsComponent implements OnInit {

    alerts:Array<Object> = []
    progs = []
    p = 0;
    
    constructor (private authService: AuthService,
		 private programsService: ProgramsService,
		 private router: Router,
		 private storageService: StorageService){}

    ngOnInit() {
	this.p = this.storageService.get("ProgramsComponent", "page", 1);
	this.programsService.getProgramsList()
            .subscribe(
                programs => {
		    this.progs = programs;
			},
                error =>  {
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
		    this.alerts.push({msg: error.msg, type: 'danger'});
		});
    }

    onNewProgram() {
	this.router.navigate(['/programs', "new"]);
    }

    onPageChange(page) {
	this.storageService.store("ProgramsComponent", "page", page);
    }
}
