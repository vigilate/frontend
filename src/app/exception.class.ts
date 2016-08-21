import {Injectable, ExceptionHandler, Injector } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './auth.service'
import { BackgroundService } from './background.service'

// Inspired from http://stackoverflow.com/questions/37592078

export class _ArrayLogger {
    res = [];
    log(s: any): void { this.res.push(s); }
    logError(s: any): void { this.res.push(s); }
    logGroup(s: any): void { this.res.push(s); }
    logGroupEnd() {};
}

@Injectable()
export class MyExceptionHandler extends ExceptionHandler {
    private router:Router;
    private authService:AuthService;
    private backgroundService:BackgroundService;
    
    constructor(private injector: Injector) {
	super(new _ArrayLogger(), true);
    }
    
    call(error, stackTrace = null, reason = null) {
	this.getDependencies();
	if (error == "NeedToReconnect")
	{
	    this.router.navigate(['/logout']);
	}
	else
	    super.call(error, stackTrace, reason);
    }

    private getDependencies(){
	if(!this.router){
	    this.router = this.injector.get(Router);
	}
	if(!this.authService){
	    this.authService = this.injector.get(AuthService);
	}
	if(!this.backgroundService){
	    this.backgroundService = this.injector.get(BackgroundService);
	}
    }
}
