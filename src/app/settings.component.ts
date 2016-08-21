import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { User } from './user.model';
import { AuthService } from './auth.service';
import { UserService } from './user.service';
import { AlertComponent } from 'ng2-bootstrap/components/alert';
import { PhoneValidator, MatchValidator, TriggerValidator } from './validation.class'
import { FormBuilder, Validators, Control, ControlGroup, FORM_DIRECTIVES } from '@angular/common';

@Component({
    selector: 'settings',
    templateUrl: 'app/settings.component.html',
    directives: [AlertComponent, FORM_DIRECTIVES]
})

export class SettingsComponent implements OnInit {

    ctrl = {
	form: null,
	phone: null,
	password: null,
	password_confirm: null
    };
    loadingSubmit = false;
    phone_number = "";
    password = "";
    password_confirm = "";
    default_alert = "";
    default_alert_types = ["EMAIL", "SMS", "WEB"];
    alerts:Array<Object> = []
    error_field = {};
    
    constructor (private authService: AuthService,
		 private userService: UserService,
		 private router: Router,
		 private builder: FormBuilder
		){}

    ngOnInit() {
	this.phone_number = this.userService.user.phone;
	this.default_alert = this.userService.user.default_alert_type;

	this.ctrl.phone = new Control("",PhoneValidator.isPrefixed);
	this.ctrl.password = new Control("", TriggerValidator(this.ctrl, "password_confirm"));
	this.ctrl.password_confirm = new Control("", MatchValidator(this.ctrl, "password"));
	this.ctrl.form = this.builder.group({
	    phone:  this.ctrl.phone,
	    password:  this.ctrl.password,
	    password_confirm:  this.ctrl.password_confirm
	});
	console.log(this.ctrl);
    }

    deleteAccount() {
	this.userService.deleteAccount().subscribe(() => {
	    this.authService.logout();
	    this.router.navigate(['/login']);
	});
    }

    onClickSubmit() {
	this.loadingSubmit = true;

	let info = {};

	info["phone"] = this.phone_number;
	info["default_alert_type"] = this.default_alert;

	if (this.password != "" && this.password == this.password_confirm) {
	    info["password"] = this.password;
	}

	this.error_field = {};
	this.userService.updateInfos(info).subscribe(
	    () => {
		this.loadingSubmit = false;
		this.alerts.push({msg: "Changes submited", type: 'success'});
	    },
	    (err) => {
		if (err.json) {
		    for (let f in err.json) {
			this.error_field[f] = err.json[f].join(" ");
		    }
		}
		this.loadingSubmit = false;
	    }
	);
    }
}
