import { Control } from "@angular/common";

interface ValidationResult {
    [key:string]:any;
}

export class PhoneValidator { 
    static isPrefixed(control: Control): ValidationResult { 
	if (control.value !="" && control.value != null && control.value.charAt(0) == "+")
	    return null;
	return {"isPrefixed": true};
    }
}

export const MatchValidator = (ctrl, toBeMatched) => {
    return (control:Control) => {
	if (ctrl[toBeMatched] && control.value != ctrl[toBeMatched].value)
	    return {"match": true};
	return null;
    };
};

export const TriggerValidator = (ctrl, toBeMatched) => {
    return (control:Control) => {
	if (ctrl[toBeMatched]) {
	    ctrl[toBeMatched].updateValueAndValidity();
	}
	return null;
    };
};

export class EmailValidator { 
    static isValid(control: Control): ValidationResult {
	if (control.value == "" || control.value == null)
	    return null;
	
	var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
	if (re.test(control.value))
	    return null;
	return {"isValidEmail": true};
    }
}
