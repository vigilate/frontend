import { Component } from '@angular/core';
import { LoginService } from './login.service';

import { User } from './user.model';

@Component({
    selector: 'login',
    templateUrl: 'app/login.component.html',
    styles: [`
	     .form-signin {
		 max-width: 330px;
		 padding: 15px;
		 margin: 0 auto;
	     }
	    `]
})

export class LoginComponent {

    errorMsg = "";
    user: User;
    username = "";
    password = "";

    constructor (private loginService: LoginService) {}
    
    onSubmit() {
	console.log("test user: " + this.username);	
	console.log("test pass: " + this.password);
	
	this.loginService.getLogin(this.username, this.password)
            .subscribe(
                user => {this.user = user;
			  console.log(this.user)},
                error =>  this.errorMsg = <any>error);
    }
}
