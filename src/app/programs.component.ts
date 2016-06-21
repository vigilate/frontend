import { Component, OnInit } from '@angular/core';
import { User } from './user.model';
import { AuthService } from './auth.service';
import { ProgramsService } from './programs.service';

@Component({
    selector: 'programs',
    templateUrl: 'app/programs.component.html',
})

export class ProgramsComponent implements OnInit {

    progs = []
    
    constructor (private authService: AuthService, private programsService: ProgramsService){}

    ngOnInit() {
	this.programsService.getProgramsList()
            .subscribe(
                programs => {
		    this.progs = programs;
			},
                error =>  {
		    console.log(error);
		    // this.alerts.push({msg: error, type: 'danger'});
		});

    }
    
}
