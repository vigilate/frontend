import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { User } from './user.model';
import { AuthService } from './auth.service';
import { UserService } from './user.service';
import { StationsService } from './stations.service';
import { PhoneValidator, MatchValidator, TriggerValidator } from './validation.class'
import { FormBuilder, Validators, Control, ControlGroup, FORM_DIRECTIVES } from '@angular/common';
import { NotificationsService } from './notifications.service'

@Component({
    selector: 'settings',
    templateUrl: 'app/settings.component.html',
    directives: [FORM_DIRECTIVES]
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
    default_alert_types = ["EMAIL", "SMS"];
    error_field = {};
    loadingPlan = {
	0:false,
	1: false,
	2: false
    }
    
    constructor (private authService: AuthService,
		 private userService: UserService,
		 private stationsService: StationsService,
		 private router: Router,
		 private builder: FormBuilder,
		 private notificationsService: NotificationsService
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
	this.userService.getUser().subscribe(
	    data => {
		this.phone_number = this.userService.user.phone;
		this.default_alert = this.userService.user.default_alert_type;
	    },
	    error => {
	    }
	);
    }

    deleteAccount() {
	let ret = window.confirm("The user '" + this.userService.user.email + "' and all the data linked to it will be deleted.");
	if (!ret)
	    return;
	this.userService.deleteAccount().subscribe(
	    () => {
		this.notificationsService.success("The user has been deleted.");
		this.router.navigate(['/logout']);
	    },
	    error => {
		if (error == "NeedToReconnect")
		    throw error;
	    }
	);
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
		this.notificationsService.info("Changes submited");
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

    onClickPlan(id) {
	this.loadingPlan[id] = true;
	let info = {"contrat": id};
	this.userService.updateInfos(info).subscribe(
	    () => {
		this.loadingPlan[id] = false;
		this.stationsService.discardCache();
		this.notificationsService.info("Changes submited");
	    },
	    (err) => {
		if (err.json) {
		    for (let f in err.json) {
			this.error_field[f] = err.json[f].join(" ");
		    }
		}
		this.loadingPlan[id] = false;
	    }
	);
    }
}
