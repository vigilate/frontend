import { Component } from '@angular/core';

import { LoginComponent } from './login.component';
import { LoginService } from './login.service';
import './rxjs-operators';

@Component({
    moduleId: module.id,
    selector: 'app-root',
    templateUrl: 'app.component.html',
    styleUrls: ['app.component.css'],
    directives: [LoginComponent],
    providers: [LoginService]
})

export class AppComponent {
    title = 'app works!';
}
