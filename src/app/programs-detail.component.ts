import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { User } from './user.model';
import { AuthService } from './auth.service';
import { ProgramsService } from './programs.service';
import { AlertComponent } from 'ng2-bootstrap/components/alert';


@Component({
    selector: 'programs-detail',
    templateUrl: 'app/programs-detail.component.html',
    directives: [AlertComponent]
})

export class ProgramsDetailComponent implements OnInit {

    alerts:Array<Object> = []
    have_changes = false;
    program_params = [
	{name: "Id", key: "id", readonly:true},
	{name: "Name", key: "program_name"},
	{name: "Version", key: "program_version"},
	{name: "Score", key: "minimum_score"},
	{name: "Poste", key: "poste"}
    ]
    program_obj_origin;
    program_obj;
    creating_new = false;
    
    constructor (private authService: AuthService,
		 private programsService: ProgramsService,
		 private router: Router,
		 private route: ActivatedRoute
		){}

    ngOnInit() {
	let sub = this.route.params.subscribe(params => {
	    if (params['id'] != "new") {
		let id = +params['id'];
		this.programsService.getProgramsDetail(id).subscribe(program => {
		    this.program_obj_origin = JSON.parse(JSON.stringify(program))
		    this.program_obj = program;
		});
	    }
	    else {
		this.program_params.shift();
		this.creating_new = true;
		this.program_obj_origin = {"program_name":"", "program_version":"",
					   "minimum_score":"", "user_id":this.authService.user[0].id};
		this.program_obj = JSON.parse(JSON.stringify(this.program_obj_origin));
	    }
	});
	
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
	this.have_changes = tmp_changes;
    }

    onSubmit() {
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
		    this.updateHaveChange();
		    this.alerts.push({msg: "Changes submited", type: 'success'});
		},
		error => {
		    this.alerts.push({msg: error, type: 'danger'});
		}
	    );
	}
    }

    onGoBackList() {
	this.router.navigate(['/programs']);
    }
}
