ko.extenders.sniff = function(target, option) {
	if (!ko.isObservable(target)) {
		return target;
	}
	if (typeof target.destroyAll === 'function') {
		target._isArray = true;
	}
	else {
		target._isArray = false;
	}
	target._trackingEnabled = true;
	target.originalValue = target._isArray ? target().slice(0) : target();

	target.modified = false;
	target.strict = option.strict !== 'undefined' && option.strict;

	target._test = function(newValue) {
    	if (newValue != target.originalValue) {
    		target.modified = true;
    	}
    	else {
    		target.modified = false;
    	}

	}
	target._test_strict = function(newValue) {
    	if (newValue !== target.originalValue) {
    		target.modified = true;
    	}
    	else {
    		target.modified = false;
    	}

	}
	target._test_array = function(newValue) {
    	if (target().length !== target.originalValue.length) {
    		target.modified = true;
    	}
    	else {
    		target.modified = false;
    	}
    	
    	if (!target.modified) {
    		for (var i=0; i<target().length; i++) {
    			var item = target()[i];
				for (var property in item) {
					var prop = item[property];
				    if (ko.isObservable(prop) && prop._trackingEnabled) {
				    	if (prop.modified) {
				    		target.modified = true;
				    		break;
				    	}
					}
				}
    			if (target()[i]._trackingEnabled && target()[i].modified) {
    				target.modified = true;
    				break;
    			}
    		}
    	}

	}	
	if (target._isArray) {
		target.test = target._test_array;
	}
	else if (target.strict) {
		target.test = target._test_strict;
	}
	else {
		target.test = target._test;
	}

	if (target._isArray) {
		target.subscribe(function(changes) {
			target.test(changes);
		}, null, "arrayChange");
		for (var i=0; i<target().length; i++) {
			var item = target()[i];
			for (var property in item) {
				var prop = item[property];
			    if (ko.isObservable(prop) && prop._trackingEnabled) {
					prop.subscribe(function(changes) {
						target.test(changes);
					});
				}
			}
		}		
	}
	else {
		target.subscribe(function(newValue) {
			target.test(newValue);
    	});
	}
    return target;
}; 