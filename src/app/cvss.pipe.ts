import { Pipe, PipeTransform } from '@angular/core';

@Pipe({name: 'cvss'})
export class CvssPipe implements PipeTransform {

    CVSS_lvalue = {
	"access-vector": "This vulnerability can be accessed via <strong>%s</strong>.",
	"access-complexity": "The complexity of exploiting this vulnerability is <strong>%s</strong>.",
	"authentication": "This vulnerability requires <strong>%s</strong> authentification to be exploited.",
	"confidentiality-impact": "This vulnerability lead to <strong>%s</strong> confidentiality impact.",
	"integrity-impact": "This vulnerability lead to <strong>%s</strong> integrity impact.",
	"availability-impact": "This vulnerability lead to <strong>%s</strong> availability impact."
    }

    transform(cvss_part: string): string {
	if (cvss_part) {
	    let splited = cvss_part.split(":");
	    let to_insert = splited[1].replace("NONE", "NO");
	    to_insert = to_insert.replace("<", "&lt;");
	    to_insert = to_insert.replace(">", "&gt;");
	    
	    return this.CVSS_lvalue[splited[0]].replace("%s", to_insert);
	}
	return "";
    }
}
