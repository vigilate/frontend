import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { User } from './user.model';
import { AuthService } from './auth.service';
import { UserService } from './user.service';
import { StationsService } from './stations.service';
import { PhoneValidator, MatchValidator, TriggerValidator } from './validation.class'
import { FormBuilder, Validators, Control, ControlGroup, FORM_DIRECTIVES } from '@angular/common';
import { NotificationsService } from './notifications.service'
import { StripeService } from './stripe.service';
import { PlansService } from './plans.service';

@Component({
    selector: 'settings',
    templateUrl: 'app/settings.component.html',
    directives: [FORM_DIRECTIVES]
})

export class SettingsComponent implements OnInit, OnDestroy {

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
    plans = []
    plans_dic = {}
    selected_plan = null;
    remaining_time = 0
    timerId = -1;
    last_reload_user = 0;

    constructor (private authService: AuthService,
		 private userService: UserService,
		 private stationsService: StationsService,
		 private router: Router,
		 private builder: FormBuilder,
		 private notificationsService: NotificationsService,
		 private stripeService: StripeService,
		 private plansService: PlansService
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
	
	this.reloadUser();
	
    }

    ngOnDestroy() {
	if (this.timerId != -1)
	    clearInterval(this.timerId);
    }


    reloadUser() {
	if (new Date().getTime()/1000 - this.last_reload_user < 1)
	    return;
	this.last_reload_user = new Date().getTime()/1000;
	
	this.userService.getUser().subscribe(
	    data => {
		this.phone_number = this.userService.user.phone;
		this.default_alert = this.userService.user.default_alert_type;
		this.reloadPlans()
	    },
	    error => {
	    }
	);
    }

    reloadPlans() {
	this.plansService.getPlansList().subscribe(
	    data => {
		this.plans = data
		for (let pl of this.plans)
		    this.plans_dic[pl.id] = pl;
		this.selected_plan = this.plans_dic[this.userService.user["plan"]]

		if (this.timerId == -1)
		    this.updateRemaining();
		
	    },
	    error => {
	    }
	);
    }

    updateRemaining() {
	if (this.timerId == -1) {
	    this.timerId = setInterval(() => this.updateRemaining(), 3000);
	}

	this.selected_plan = this.plans_dic[this.userService.user["plan"]]

	if (this.selected_plan.validity_time == 0)
	    return;
	    
	this.remaining_time = new Date().getTime() / 1000;
	this.remaining_time -= new Date(this.userService.user["plan_purchase_date"]).getTime() / 1000;
	this.remaining_time = this.selected_plan.validity_time - this.remaining_time;
	this.remaining_time = Math.ceil(this.remaining_time);

	if (this.remaining_time <= 0)
	{
	    this.reloadUser();
	    this.stationsService.discardCache();
	}
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

    onClickPlan(plan) {
	this.stripeService.setProduct(plan.id, plan.price*100, plan.name);
	this.stripeService.checkout();
    }
}
