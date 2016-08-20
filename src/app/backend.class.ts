
export class Backend {
    private host: string = "https://vigilate.eax.ovh/api/v1";

    constructor() {
	if (localStorage.getItem("host") != null)
	    this.setHost(localStorage.getItem("host"));
    }
    
    getHost() {	
	return this.host;
    }

    setHost(host) {
	localStorage.setItem("host", host);
	this.host = host;
    }
}
