import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { User } from './user.model';
import { AuthService } from './auth.service';
import { UserService } from './user.service';

@Component({
    selector: 'settings',
    templateUrl: 'app/settings.component.html',
})

export class SettingsComponent {

    
    constructor (private authService: AuthService,
		 private userService: UserService,
		 private router: Router
		){}

    deleteAccount() {
	this.userService.deleteAccount().subscribe(() => {
	    this.authService.logout();
	    this.router.navigate(['/login']);
	});
    }

}
