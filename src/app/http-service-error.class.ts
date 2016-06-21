import { Observable } from 'rxjs/Observable';

export class HttpServiceError {
    
    public handleError (error: any) {
	try {
	    let j = JSON.parse(error._body);
	    if ("detail" in j)
		return Observable.throw(j["detail"]);
	    else
		return Observable.throw(error._body);
	}
	catch (exp) {
	    console.log(exp);
	}
	let errMsg = (error.message) ? error.message :
	    error.status ? `${error.status} - ${error.statusText}` : 'Server error';

	return Observable.throw(errMsg);
    }
}
