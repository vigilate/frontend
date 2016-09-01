import { Injectable, Output, EventEmitter } from '@angular/core';

import { Observable } from 'rxjs/Observable';
import { HttpServiceError } from './http-service-error.class'
import { Api } from './api.service';
import { UserService } from './user.service';
import { StationsService } from './stations.service';

@Injectable()
export class StripeService {

    private amount = 0;
    private description = "";
    private id_plan = 0;
    private handler = null;
    
    constructor (private api: Api,
		 private httpServiceError: HttpServiceError,
		 private userService: UserService,
		 private stationsService: StationsService
		) {
	this.configure();
    }

    configure() {
	if (!("StripeCheckout" in window)) {
	    console.log("StipeCheckout is not present");
	    return;
	}
	this.handler = window["StripeCheckout"].configure({ 
	    key: 'pk_test_P21OD1NRP68DvjfKeLLvnmxS',
	    image: '/foundation/img/vigilate_logo.png',
	    locale: 'auto',
	    
	    token: (token) => this.sendInfoBackend(token)
	});
    }
    
    setProduct(id_plan, amount, description) {
	this.id_plan = id_plan;
	this.amount = Math.round(amount);
	this.description = description;
	console.log(this.amount);
    }

    checkout() {
	if (this.id_plan == 0) {
	    this.sendInfoBackend("")
	    this.userService.getUser().subscribe();
	    return;
	}
	if (this.handler == null) {
	    console.log("stripe is not loaded")
	    return;
	}
	    
	this.handler.open({
	    name: 'Vigilate',
	    description: this.description,
	    currency: 'EUR',
	    amount: this.amount
	});
    }

    sendInfoBackend(token) {

	var body = JSON.stringify({ token:token.id });

	this.api.post("/checkout/" + this.id_plan + "/", body, false).subscribe(
		data => {
		    console.log(data);
		    this.userService.getUser().subscribe();
		    this.stationsService.discardCache();
		},
		error => {
		    console.log(error);
		}
	    );
    }
    
}
