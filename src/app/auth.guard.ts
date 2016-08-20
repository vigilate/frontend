import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { AuthService } from './auth.service';
import { UserService } from './user.service';
import { StorageService } from './storage.service'
import { BackgroundService } from './background.service';

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(private authService: AuthService,
		private userService: UserService,
		private router: Router,
		private backgroundService: BackgroundService,
		private storageService: StorageService) {}

    
    canActivate(route, state) : Observable<boolean> | boolean {
	if (this.authService.isLoggedIn) {
	    return true;
	}
	this.router.navigate(['/login']);
	if (this.authService.token != "") {
	    return this.authService.checkToken()
		.do(data => {
		    if (data) {
			this.userService.getUser().subscribe(
			    () => {
				this.backgroundService.init()
				this.router.navigate(['/' + route.urlSegments[0].path]);
			    });
		    }
		});	    
	}
	if (route.urlSegments[0])
	    this.storageService.store("AuthGuard", "redirect", route.urlSegments[0].path);
	return false;
    }a
}
