import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { User } from './user.model';
import { AuthService } from './auth.service';
import { AlertsService } from './alerts.service';
import { AlertComponent } from 'ng2-bootstrap/components/alert';
import { CvssPipe } from './cvss.pipe';

@Component({
    selector: 'alerts-detail',
    templateUrl: 'app/alerts-detail.component.html',
    directives: [AlertComponent],
    pipes: [CvssPipe]
})

export class AlertsDetailComponent implements OnInit {
    alertsHtml:Array<Object> = []
    alerts_obj;

    constructor (private authService: AuthService,
		 private alertsService: AlertsService,
		 private router: Router,
		 private route: ActivatedRoute
		){}

    ngOnInit() {
	let sub = this.route.params.subscribe(params => {
	    let id = +params['id'];
	    this.alertsService.getAlertsDetail(id).subscribe(program => {
		this.alerts_obj = JSON.parse(JSON.stringify(program))
	    });
	});
    }

    onGoBackList() {
	this.router.navigate(['/alerts']);
    }
}
