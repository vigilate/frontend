import { Injectable } from '@angular/core';

import { Observable } from 'rxjs/Observable';

@Injectable()
export class StorageService {

    storage = {}
    
    constructor () {}

    store(client, key, value) {
	if (!(client in this.storage)) {
	    this.storage[client] = {}
	}
	this.storage[client][key] = value;
    }

    get(client, key, def) {	
	if (!(client in this.storage)) {
	    return def;
	}

	if (!(key in this.storage[client])) {
	    return def;
	}

	return this.storage[client][key]
    }

    delete(client, key) {
	if (!(client in this.storage)) {
	    return;
	}
	delete this.storage[client][key];
    }

    
}
