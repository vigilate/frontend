import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './auth.service';
import { User } from './user.model';
import { BackgroundService } from './background.service';
import { AlertComponent } from 'ng2-bootstrap/components/alert';

@Component({
    templateUrl: 'app/login.component.html',
    styleUrls: ['app/login.component.css'],
     directives: [AlertComponent]
})

export class LoginComponent {

    user: User = null;
    email = "";
    password = "";
    public alerts:Array<Object> = []
    loadingLogin = false;
    loadingSignin = false;

    constructor (private authService: AuthService,
		 private router: Router,
		 private backgroundService: BackgroundService) {}
    
    onSubmitLogin() {

	this.loadingLogin = true;
	this.authService.login(this.email, this.password)
            .subscribe(
                user => {this.user = user;
			 console.log(this.user)
			 this.loadingLogin = false;
			 this.backgroundService.init()
			 this.router.navigate(['/dashboard']);
			},
                error =>  {
		    console.error(error);
		    this.loadingLogin = false;
		    this.alerts.push({msg: error, type: 'danger'});
		});
    }

    onSubmitSignin() {

	this.loadingSignin = true;
	this.authService.signin(this.email, this.password)
            .subscribe(
                user => {this.user = user;
			 console.log(this.user)
			 this.loadingSignin = false;
			 this.alerts.push({msg: "User " + user.email + " created", type: 'success'});
			},
                error =>  {
		    console.error(error);
		    this.loadingSignin = false;
		    this.alerts.push({msg: error, type: 'danger'});
		});
    }
}
