import { Observable } from 'rxjs/Observable';

export class HttpServiceError {
    
    public handleError (error: any) {
	let error_resp = {
	    code: 0,
	    msg: ""
	}

	error_resp.code = error.status;
	error_resp.msg = error._body;
	
	try {
	    let j = JSON.parse(error._body);
	    if ("detail" in j)
		error_resp.msg = j["detail"]
	}
	catch (e) {}
	
	return Observable.throw(error_resp);
    }
}
