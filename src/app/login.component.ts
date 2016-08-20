import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './auth.service';
import { User } from './user.model';
import { BackgroundService } from './background.service';
import { UserService } from './user.service';
import { AlertComponent } from 'ng2-bootstrap/components/alert';
import { StorageService } from './storage.service'

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

    constructor (private authService: AuthService,
		 private userService: UserService,
		 private router: Router,
		 private backgroundService: BackgroundService,
		 private storageService: StorageService) {}

    ngOnInit() {
	if (this.authService.isLoggedIn)
	    this.router.navigate(['/dashboard']);
	if (!this.backgroundService.is_new)
	    window.location.replace('/');
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
