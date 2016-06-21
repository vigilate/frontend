import { Component } from '@angular/core';
import { User } from './user.model';
import { AuthService } from './auth.service';
import { UserService } from './user.service';

@Component({
    selector: 'dasboard',
    templateUrl: 'app/dashboard.component.html',
})

export class DashboardComponent {

    
    constructor (private authService: AuthService, private userService: UserService){}

    deleteAccount() {
	this.userService.deleteAccount().subscribe();
    }
    
}
