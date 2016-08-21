import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { AuthService } from './auth.service';
import { UserService } from './user.service';
import { StorageService } from './storage.service'
import { BackgroundService } from './background.service';
import './rxjs-operators';

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(private authService: AuthService,
		private userService: UserService,
		private router: Router,
		private backgroundService: BackgroundService,
		private storageService: StorageService) {}

    
    canActivate(route, state) : Observable<boolean> | boolean {
	let redirect_to = "dashboard";
	if (route.urlSegments && route.urlSegments[0])
	    redirect_to = route.urlSegments[0].path;

	if (this.authService.isLoggedIn && this.userService.user)
	    return true;
	if (this.authService.token != "") {
	    return this.authService.checkToken().flatMap(
		data => {
		    if (data.ok) {
			return this.userService.getUser().map(
			    () => {
				this.backgroundService.init()
				return true;
			    });
		    }
		    else
		    {
			this.goToLogin(redirect_to);
			return Observable.of(false);
		    }
		})
		.catch(() => {
		    this.goToLogin(redirect_to);
		    return Observable.of(false);
		});
	}
	this.goToLogin(redirect_to);
	return false;
    }

    goToLogin(redirect_to) {
	this.storageService.store("AuthGuard", "redirect", redirect_to);
	this.router.navigate(['/login']);
    }
}
