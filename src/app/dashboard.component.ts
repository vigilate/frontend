import { Component } from '@angular/core';
import { User } from './user.model';
import { AuthService } from './auth.service';

@Component({
    selector: 'dasboard',
    templateUrl: 'app/dashboard.component.html',
})

export class DashboardComponent {

    
    constructor (private authService: AuthService){}
    
}
