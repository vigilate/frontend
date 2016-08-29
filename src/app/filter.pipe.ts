import { Pipe, PipeTransform } from '@angular/core';

@Pipe({name: 'filter'})
export class FilterPipe implements PipeTransform {

    transform(list: any, str_filter): string {
	if (str_filter == "")
	    return list;

	let obj_type = "prog";
	if (list && list.length && "program_info" in list[0])
	    obj_type = "alert"
	
	
	let rules = {
	    "contain_str": [],
	    "version":[],
	    "station":[],
	    "is": [],
	    "state":[]
	};

	let reversable = ["is", "state"];

	if (obj_type != "alert")
	    delete rules.state;

	for (let word of str_filter.split(" ")) {
	    let op_idx = word.indexOf(":");
	    if (op_idx != -1) {
		let op_key = word.substring(0, op_idx);

		if (op_key in rules) {
		    let op_value = word.substring(op_idx + 1);
		    let reversed = false;

		    if (op_value.startsWith("!") && reversable.indexOf(op_key) != -1) {

			reversed = true;
			op_value = op_value.substring(1);
		    }
		    if (op_value != "")
			rules[op_key].push({"reversed": reversed, "value":op_value});
		}
		else
		    rules.contain_str.push(word);			 
	    }
	    else
		rules.contain_str.push(word);
	}

	return list.filter(obj => {

	    let name;
	    let version;
	    let station;
	    
	    if (obj_type == "prog") {
		name = obj.program_name;
		version = obj.version;
		station = obj.station_name;
	    }
	    else {
		name = obj.program_info.program_name;
		version = obj.program_info.program_version;
		station = obj.program_info.station_name;
	    }
	    
	    let ret = true;
	    for (let word of rules.contain_str)
		ret = ret && name.indexOf(word) !== -1;
	    if (!ret)
		return ret;

	    ret = false;
	    for (let op_is of rules.is) {
		if (op_is.value.startsWith("v") && obj_type == "prog") // vuln
		    ret = ret || (obj.alert_id != null) != op_is.reversed;
		else if (op_is.value.startsWith("r") && obj_type == "alert") // read
		    ret = ret || (!!obj.view) != op_is.reversed;
		else if (op_is.value.startsWith("n") && obj_type == "alert") // new
		    ret = ret || !((!!obj.view) != op_is.reversed);
	    }
	    if (rules.is.length && !ret)
		return ret;


	    if ("state" in rules) {
		ret = false;
		for (let op_state of rules.state) {
		    if (op_state.value.startsWith("e")) // exploit
			ret = ret || (("exploit" in obj.state) != op_state.reversed);
		    else if (op_state.value.startsWith("p")) // patch
			ret = ret || (("patch" in obj.state) != op_state.reversed);
		}
		if (rules.state.length && !ret)
		    return ret;
	    }

	    
	    ret = false;
	    for (let op_version of rules.version) {
		ret = ret || version.indexOf(op_version) !== -1;
	    }
	    if (rules.version.length && !ret)
		return ret;

	    ret = false;
	    for (let op_station of rules.station) {
		ret = ret || station.indexOf(op_station) !== -1;
	    }
	    if (rules.station.length && !ret)
		return ret;

	    return true;
	});
    }
}
