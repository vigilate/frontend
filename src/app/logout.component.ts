import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './auth.service';
import { BackgroundService } from './background.service';
import { UserService } from './user.service';

@Component({
    template: ''
})

export class LogoutComponent implements OnInit {


    constructor (private authService: AuthService,
		 private router: Router,
		 private backgroundService: BackgroundService) {}

    ngOnInit() {
	if (!this.authService.isLoggedIn && !this.backgroundService.is_new)
	    this.router.navigate(['/login']);
	this.authService.logout();
	this.backgroundService.stop();
	window.location.replace('/');
    }
}
