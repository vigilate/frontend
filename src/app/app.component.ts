import { Component } from '@angular/core';
import { LoginComponent } from './login.component';
import './rxjs-operators';

@Component({
    moduleId: module.id,
    selector: 'app-root',
    templateUrl: 'app.component.html',
    styleUrls: ['app.component.css'],
    directives: [LoginComponent]
})

export class AppComponent {
    title = 'app works!';
}
