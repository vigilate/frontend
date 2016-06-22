import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { User } from './user.model';
import { AuthService } from './auth.service';
import { ProgramsService } from './programs.service';
import { AlertComponent } from 'ng2-bootstrap/components/alert';

@Component({
    selector: 'programs',
    templateUrl: 'app/programs.component.html',
    directives: [AlertComponent]
})

export class ProgramsComponent implements OnInit {

    alerts:Array<Object> = []
    progs = []
    
    constructor (private authService: AuthService,
		 private programsService: ProgramsService,
		 private router: Router){}

    ngOnInit() {
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
		    this.alerts.push({msg: error, type: 'danger'});
		});
    }

    onNewProgram() {
	this.router.navigate(['/programs', "new"]);
    }
}
