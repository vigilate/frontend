import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from './auth.service';
import { User } from './user.model';
import { BackgroundService } from './background.service';
import { UserService } from './user.service';
import { StorageService } from './storage.service'
import { EmailValidator } from './validation.class'
import { FormBuilder, Validators, Control, ControlGroup, FORM_DIRECTIVES } from '@angular/common';
import { NotificationsService } from './notifications.service'

@Component({
    templateUrl: 'app/login.component.html',
    styleUrls: ['app/login.component.css'],
    directives: [FORM_DIRECTIVES]
})

export class LoginComponent implements OnInit {

    user: User = null;
    email = "";
    password = "";
    loadingLogin = false;
    loadingSignin = false;
    clicked = false;

    ctrl = {
	form: null,
	email: null,
	password: null
    }
    error_field = {};

    constructor (private authService: AuthService,
		 private userService: UserService,
		 private router: Router,
		 private route: ActivatedRoute,
		 private backgroundService: BackgroundService,
		 private storageService: StorageService,
		 private builder: FormBuilder,
		 private notificationsService: NotificationsService
		) {}

    ngOnInit() {
	if (this.authService.isLoggedIn || (!this.authService.triedToConnect && this.authService.token != ""))
	    this.router.navigate(['/dashboard']);
	this.ctrl.email = new Control("",Validators.compose([Validators.required, EmailValidator.isValid]));
	this.ctrl.password = new Control('', Validators.required);
	this.ctrl.form = this.builder.group({
	    email:  this.ctrl.email,
	    password: this.ctrl.password
	});
    }
    
    onSubmitLogin() {
	this.clicked = true;
	if (!this.ctrl.form.valid)
	    return;
	this.loadingLogin = true;
	this.login();
    }

    login() {
	this.error_field = {};
	this.authService.login(this.email, this.password)
            .subscribe(
		data => {
		    this.getUser();
		},
		error =>  {
		    console.error(error);
		    this.loadingLogin = false;
		    if (error.json) {
			for (let f in error.json) {
			    this.error_field[f] = error.json[f].join(" ");
			}
		    }
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
		    if (error.json) {
			for (let f in error.json) {
			    this.error_field[f] = error.json[f].join(" ");
			}
		    }
		});

    }

    onSubmitSignin() {
	this.clicked = true;
	if (!this.ctrl.form.valid)
	    return;
	this.error_field = {};
	this.loadingSignin = true;
	this.authService.signin(this.email, this.password)
            .subscribe(
                user => {
		    console.log(this.user)
		    this.loadingSignin = false;
		    this.notificationsService.success("User " + user.email + " created");
		},
                error =>  {
		    console.error(error);
		    this.loadingSignin = false;
		    if (error.json) {
			for (let f in error.json) {
			    this.error_field[f] = error.json[f].join(" ");
			}
		    }
		});
    }
}
