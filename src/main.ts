import { bootstrap } from '@angular/platform-browser-dynamic';
import { HTTP_PROVIDERS } from '@angular/http';
import { enableProdMode, ExceptionHandler } from '@angular/core';
import { AppComponent, environment } from './app/';
import { APP_ROUTER_PROVIDERS } from './app/app.routes';
import { LocationStrategy, HashLocationStrategy } from '@angular/common';
import { MyExceptionHandler } from './app/exception.class';

if (environment.production) {
  enableProdMode();
}

bootstrap(AppComponent, [HTTP_PROVIDERS, APP_ROUTER_PROVIDERS, {provide: LocationStrategy, useClass: HashLocationStrategy}, {provide: ExceptionHandler, useClass: MyExceptionHandler}]);

