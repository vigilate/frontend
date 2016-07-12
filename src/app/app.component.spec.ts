/* tslint:disable:no-unused-variable */

import {
  beforeEach, beforeEachProviders,
  describe, xdescribe,
  expect, it, xit,
  async, inject
} from '@angular/core/testing';

import { provide } from '@angular/core';
import { BaseRequestOptions, Response, ResponseOptions, Http } from '@angular/http';
import { MockBackend, MockConnection } from '@angular/http/testing';

import { AppComponent } from './app.component';
import { AuthService } from './auth.service'
import { AlertsService } from './alerts.service';
import { ProgramsService } from './programs.service'
import { HttpServiceError } from './http-service-error.class'
import { Backend } from './backend.class'

beforeEachProviders(() => [
    AppComponent,
    AuthService,
    HttpServiceError,
    ProgramsService,
    AlertsService,
    BaseRequestOptions,
    MockBackend,
    Backend,
    provide(Http, {
	useFactory: (backend: MockBackend, defaultOptions: BaseRequestOptions) => {
	    return new Http(backend, defaultOptions);
	},
	deps: [MockBackend, BaseRequestOptions]
    })
]);

describe('App: VigilateFrontend', () => {
	
    it('should create the app',
       inject([AppComponent], (app: AppComponent) => {
	   expect(app).toBeTruthy();
       }));
});
