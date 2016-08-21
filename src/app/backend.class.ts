
export class Backend {
    private host: string = "https://vigilate.eax.ovh";
    private api_path: string = "/api/v1";

    constructor() {
	if (localStorage.getItem("host") != null)
	    this.setHost(localStorage.getItem("host"));
    }
    
    getHost() {	
	return this.host;
    }

    getUrl() {	
	return this.host + this.api_path;
    }

    setHost(host) {
	localStorage.setItem("host", host);
	this.host = host;
    }
}
