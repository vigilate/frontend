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
	    if (word == "")
	    	continue;
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

	let matching = list.filter(obj => {

	    let name;
	    let version;
	    let station;
	    
	    if (obj_type == "prog") {
		name = obj.program_name;
		version = obj.program_version;
		station = obj.station_name;
	    }
	    else {
		name = obj.program_info.program_name;
		version = obj.program_info.program_version;
		station = obj.program_info.station_name;
	    }

	    let ret;
	    if (rules.contain_str.length) {
		ret = false;
		for (let word of rules.contain_str)
		    ret = ret || name.indexOf(word) !== -1;
		if (!ret)
		    return ret;
	    }

	    if (rules.is.length) {
		ret = false;
		for (let op_is of rules.is) {
		    if (op_is.value.startsWith("v") && obj_type == "prog") // vuln
			ret = ret || (obj.alert_id != null) != op_is.reversed;
		    else if (op_is.value.startsWith("r") && obj_type == "alert") // read
			ret = ret || (!!obj.view) != op_is.reversed;
		    else if (op_is.value.startsWith("n") && obj_type == "alert") // new
			ret = ret || !((!!obj.view) != op_is.reversed);
		}
		if (!ret)
		    return ret;
	    }


	    if ("state" in rules) {
		ret = false;
		for (let op_state of rules.state) {
		    if (op_state.value.startsWith("e")) // exploit
			ret = ret || ((obj.state.indexOf("exploit") !== -1) != op_state.reversed);
		    else if (op_state.value.startsWith("p")) // patch
			ret = ret || ((obj.state.indexOf("patch") !== -1) != op_state.reversed);
		}
		if (rules.state.length && !ret)
		    return ret;
	    }


	    if (rules.version.length) {
		ret = false;
		for (let op_version of rules.version) {
		    ret = ret || version.indexOf(op_version.value) !== -1;
		}
		if (!ret)
		    return ret;
	    }

	    ret = false;
	    for (let op_station of rules.station) {
		ret = ret || station.indexOf(op_station.value) !== -1;
	    }
	    if (rules.station.length && !ret)
		return ret;

	    return true;
	});

	matching = JSON.parse(JSON.stringify(matching));
	return matching.map(obj => {
	    let name;
	    let version;
	    let station;
	    
	    if (obj_type == "prog") {
	    	name = obj.program_name;
	    	version = obj.program_version;
	    	station = obj.station_name;
	    }
	    else {
	    	name = obj.program_info.program_name;
	    	version = obj.program_info.program_version;
	    	station = obj.program_info.station_name;
	    }
	    name = this.htmlEscape(name);
	    version = this.htmlEscape(version);
	    station = this.htmlEscape(station);

	    name = this.hl(name, rules.contain_str);
	    if (rules.version.length)
		version = this.hl(version, rules.version.map(o => o.value));
	    if (rules.station.length)
		station = this.hl(station, rules.station.map(o => o.value));

	    
	    if (obj_type == "prog") {
	    	obj.program_name = name;
	    	obj.program_version = version;
	    	obj.station_name = station;
	    }
	    else {
	    	obj.program_info.program_name = name;
	    	obj.program_info.program_version = version;
	    	obj.program_info.station_name = station;
	    }

	    
	    return obj;
	    
	});

    }

    hl(str, values) {
	if (!values.length)
	    return str;
	let dic = {}	    
	for (let val of values) {
	    dic[val] = '<span class="filterHl">' + val + '</span>';
	}
	let re = new RegExp(values.join("|"),"gi");
	str = str.replace(re, (matched) => {
	    return dic[matched];
	});
	return str;
    }

    htmlEscape(val) {
	val = val.replace("<", "&lt;");
	val = val.replace(">", "&gt;");
	return val;
    }
}
