import { Component } from '@angular/core';
import { LoginService } from './login.service';


@Component({
    selector: 'login',
    templateUrl: 'app/login.component.html',
    styles: ["label{width:100px;}"],
    providers: [LoginService]
})

export class LoginComponent {

    errorMsg = "";
    login = "";
    user = "";
    password = "";

    constructor (private loginService: LoginService) {}
    
    onSubmit() {
	console.log("test user: " + this.user);	
	console.log("test pass: " + this.password);
	
	this.loginService.getLogin(this.user, this.password)
            .subscribe(
                login => this.login = login,
                error =>  this.errorMsg = <any>error);
    }
}
