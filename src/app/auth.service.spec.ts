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
import { HttpServiceError } from './http-service-error.class'

describe('AuthService', () => {

    beforeEachProviders(() => [
	AuthService,
	HttpServiceError,
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
	this.email = "UserA@a.com";
	this.pwd = "PwdA";

	this.baseResponseGood = new Response(new ResponseOptions(
	    {
		status: 200,
		body: JSON.stringify(
		[
		    {
			"id":1,
			"email": this.email,
			"password":"hash",
			"user_type":0,
			"contrat":0,
			"id_dealer":0
		    }
		])
	    }
	));

	this.baseResponseBadEmail = new Response(new ResponseOptions(
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

	   authService.login(this.email, this.pwd).subscribe((res: User) => {
	       expect(res[0]["email"]).toBe(this.email);
	   });
       })
      );

    
    it('must be connected after successfull logging in',
       inject([AuthService, MockBackend], (authService: AuthService, backend: MockBackend) => {
	   backend.connections.subscribe((c: MockConnection) => c.mockRespond(this.baseResponseGood));

	   authService.login(this.email, this.pwd).subscribe((res: User) => {
	       expect(authService.isLoggedIn).toBe(true);
	   });
       })
      );


    it('must not be connected after bad email',
       inject([AuthService, MockBackend], (authService: AuthService, backend: MockBackend) => {
	   backend.connections.subscribe((c: MockConnection) => c.mockRespond(this.baseResponseBadEmail));

	   authService.login(this.email, this.pwd).subscribe((res: User) => {
	       expect(authService.isLoggedIn).toBe(false);
	   });
       })
      );


    it('must not be connected after bad password',
       inject([AuthService, MockBackend], (authService: AuthService, backend: MockBackend) => {
	   backend.connections.subscribe((c: MockConnection) => c.mockRespond(this.baseResponseBadPassword));

	   authService.login(this.email, this.pwd).subscribe((res: User) => {
	       expect(authService.isLoggedIn).toBe(false);
	   });
       })
      );



});
