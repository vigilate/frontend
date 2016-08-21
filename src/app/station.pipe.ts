import { Pipe, PipeTransform } from '@angular/core';

@Pipe({name: 'station'})
export class StationPipe implements PipeTransform {

    transform(prog_list: any, args): string {
	let station_id = args;

	return prog_list.filter(prog => {
	    return station_id == "all" || prog.poste == station_id;
	});
    }
}
