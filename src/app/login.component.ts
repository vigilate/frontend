import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from './auth.service';
import { User } from './user.model';
import { BackgroundService } from './background.service';
import { UserService } from './user.service';
import { AlertComponent } from 'ng2-bootstrap/components/alert';
import { StorageService } from './storage.service'
import { EmailValidator } from './validation.class'
import { FormBuilder, Validators, Control, ControlGroup, FORM_DIRECTIVES } from '@angular/common';

@Component({
    templateUrl: 'app/login.component.html',
    styleUrls: ['app/login.component.css'],
     directives: [AlertComponent]
})

export class LoginComponent implements OnInit {

    user: User = null;
    email = "";
    password = "";
    public alerts:Array<Object> = []
    loadingLogin = false;
    loadingSignin = false;

    ctrl = {
	form: null,
	email: null,
    }

    constructor (private authService: AuthService,
		 private userService: UserService,
		 private router: Router,
		 private route: ActivatedRoute,
		 private backgroundService: BackgroundService,
		 private storageService: StorageService,
		 private builder: FormBuilder) {}

    ngOnInit() {
	if (this.authService.isLoggedIn || (!this.authService.triedToConnect && this.authService.token != ""))
	    this.router.navigate(['/dashboard']);
	this.ctrl.email = new Control("",EmailValidator.isValid);
	this.ctrl.form = this.builder.group({
	    email:  this.ctrl.email
	});
    }
    
    onSubmitLogin() {

	this.loadingLogin = true;
	this.login();
    }

    login() {
	this.authService.login(this.email, this.password)
            .subscribe(
		data => {
		    console.log(data)
		    this.getUser();
		},
		error =>  {
		    console.error(error);
		    this.loadingLogin = false;
		    this.alerts.push({msg: error.msg, type: 'danger'});
		});
    }

    getUser() {
	this.userService.getUser()
            .subscribe(
                data => {
		    console.log(data)
		    this.loadingLogin = false;
		    this.backgroundService.init()
		    let redir = this.storageService.get("AuthGuard", "redirect", "dashboard");
		    this.storageService.delete("AuthGuard", "redirect");
		    this.router.navigate(['/' + redir]);
			},
                error =>  {
		    console.error(error);
		    this.loadingLogin = false;
		    this.alerts.push({msg: error.msg, type: 'danger'});
		});

    }

    onSubmitSignin() {

	this.loadingSignin = true;
	this.authService.signin(this.email, this.password)
            .subscribe(
                user => {
			 console.log(this.user)
			 this.loadingSignin = false;
			 this.alerts.push({msg: "User " + user.email + " created", type: 'success'});
			},
                error =>  {
		    console.error(error);
		    this.loadingSignin = false;
		    this.alerts.push({msg: error.msg, type: 'danger'});
		});
    }
}
