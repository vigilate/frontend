import { Control } from "@angular/common";

interface ValidationResult {
    [key:string]:any;
}

export class PhoneValidator { 
    static isPrefixed(control: Control): ValidationResult { 
	if (control.value !="" && control.value.charAt(0) == "+")
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
