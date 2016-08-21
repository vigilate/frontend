import { Observable } from 'rxjs/Observable';


export class HttpServiceError {

    lastError = 0;
     
    public handleError (error: any) {
	let error_resp = {
	    code: 0,
	    msg: "",
	    json: null
	}

	error_resp.code = error.status;
	error_resp.msg = error._body;
	
	try {
	    let j = JSON.parse(error._body);
	    if ("detail" in j)
		error_resp.msg = j["detail"]
	    else {
		error_resp.msg = "";
		error_resp.json = j;
	    }
	}
	catch (e) {}

	this.lastError = error_resp.code;
	if (error_resp.code == 401) {
	    throw "NeedToReconnect";
	}
	return Observable.throw(error_resp);
    }
}
