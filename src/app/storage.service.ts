import { Injectable, Output, EventEmitter } from '@angular/core';

import { Observable } from 'rxjs/Observable';

@Injectable()
export class StorageService {

    storage = {}
    @Output() updated = new EventEmitter();
    
    constructor () {}

    store(client, key, value) {
	if (!(client in this.storage)) {
	    this.storage[client] = {}
	}
	this.storage[client][key] = value;
	this.updated.emit({"client":client, "key": key, "value":value});
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

	if (!(key in this.storage[client])) {
	    return;
	}

	delete this.storage[client][key];
    }

    
}
