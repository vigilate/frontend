import { Pipe, PipeTransform } from '@angular/core';

@Pipe({name: 'station'})
export class StationPipe implements PipeTransform {

    transform(list: any, arg_type, station_id): string {
	if (arg_type == "prog")
	    return list.filter(obj => {
		return station_id == "all" || obj.poste == station_id;
	    });
	return list.filter(obj => {
	    return station_id == "all" || obj.program_info.poste == station_id;
	});
    }
}
