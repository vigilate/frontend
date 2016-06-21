import {
  beforeEach, beforeEachProviders,
  describe, xdescribe,
  expect, it, xit,
  async, inject
} from '@angular/core/testing';

import { BaseRequestOptions, Response, ResponseOptions, Http } from '@angular/http';
import { MockBackend, MockConnection } from '@angular/http/testing';
import { provide } from '@angular/core';
import 'app/rxjs-operators'

import { User } from './user.model';
import { AuthService } from './auth.service';

describe('AuthService', () => {

    beforeEachProviders(() => [
	AuthService,
	BaseRequestOptions,
	MockBackend,
	provide(Http, {
	    useFactory: (backend: MockBackend, defaultOptions: BaseRequestOptions) => {
		return new Http(backend, defaultOptions);
	    },
	    deps: [MockBackend, BaseRequestOptions]
	})
    ]);

    beforeEach(() => {
	this.username = "UsernameA";
	this.pwd = "PwdA";

	this.baseResponseGood = new Response(new ResponseOptions(
	    {
		status: 200,
		body: JSON.stringify(
		[
		    {
			"id":1,
			"username": this.username,
			"email":"a",
			"password":"hash",
			"user_type":0,
			"contrat":0,
			"id_dealer":0
		    }
		])
	    }
	));

	this.baseResponseBadUsername = new Response(new ResponseOptions(
	    {
		status: 401,
		body: JSON.stringify(
		{
		    "detail": "No such user"
		}),
	    } 
	));


	this.baseResponseBadPassword = new Response(new ResponseOptions(
	    {
		status: 401,
		body: JSON.stringify(
		{
		    "detail": "Wrong password"
		}),
	    } 
	));

    });

    

    it('must not be connected before logging in',
       inject([AuthService], (authService: AuthService, backend: MockBackend) => {
	   expect(authService.isLoggedIn).toBe(false);
       })
      );

    it('must return user object',
       inject([AuthService, MockBackend], (authService: AuthService, backend: MockBackend) => {
	   backend.connections.subscribe((c: MockConnection) => c.mockRespond(this.baseResponseGood));

	   authService.login(this.username, this.pwd).subscribe((res: User) => {
	       expect(res[0]["username"]).toBe(this.username);
	   });
       })
      );

    
    it('must be connected after successfull logging in',
       inject([AuthService, MockBackend], (authService: AuthService, backend: MockBackend) => {
	   backend.connections.subscribe((c: MockConnection) => c.mockRespond(this.baseResponseGood));

	   authService.login(this.username, this.pwd).subscribe((res: User) => {
	       expect(authService.isLoggedIn).toBe(true);
	   });
       })
      );


    it('must not be connected after bad username',
       inject([AuthService, MockBackend], (authService: AuthService, backend: MockBackend) => {
	   backend.connections.subscribe((c: MockConnection) => c.mockRespond(this.baseResponseBadUsername));

	   authService.login(this.username, this.pwd).subscribe((res: User) => {
	       expect(authService.isLoggedIn).toBe(false);
	   });
       })
      );


    it('must not be connected after bad password',
       inject([AuthService, MockBackend], (authService: AuthService, backend: MockBackend) => {
	   backend.connections.subscribe((c: MockConnection) => c.mockRespond(this.baseResponseBadPassword));

	   authService.login(this.username, this.pwd).subscribe((res: User) => {
	       expect(authService.isLoggedIn).toBe(false);
	   });
       })
      );



});
