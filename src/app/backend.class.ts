
export class Backend {
    private host: string = "https://vigilate.eax.ovh/api/v1";

    getHost() {
	return this.host;
    }

    setHost(host) {
	this.host = host;
    }
}
