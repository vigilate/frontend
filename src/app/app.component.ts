import { Component, ViewChild, OnInit } from '@angular/core';

import { LoginComponent } from './login.component';
import { AuthService } from './auth.service';
import { ROUTER_DIRECTIVES } from '@angular/router';
import './rxjs-operators';

@Component({
    moduleId: module.id,
    selector: 'app-root',
    templateUrl: 'app.component.html',
    styleUrls: ['app.component.css'],
    directives: [ROUTER_DIRECTIVES, LoginComponent]
})

export class AppComponent {

}