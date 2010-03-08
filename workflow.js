exports.run = function(funs, ctx, params) {
    if (params === undefined) params = [];
    if (funs && funs[0]) {
	var fun = funs[0];
	switch(typeof(fun)) {
	case "function":
	    // simplest case is just a function
	    fun.apply(this, [funs.slice(1), ctx].concat(params));
	    break;
	case "object":	
	    // more complex syntax for segment specific parameters, format is [function, param1, param2]
	    fun[0].apply(this, [funs.slice(1), ctx].concat(fun.slice(1), params));
	}}};
