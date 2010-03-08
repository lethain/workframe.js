
/*
 * Field is a list of dictionaries in format: 
 *     { name:"title", 
 *       type:"string",
 *       coerce:parseInt
 *     }
 * Processing works as follows:
 *     1. check that the fields exist.
 *     2. coerce function (if any) is applied to the value.
 *     3. check typeof output of coerce function against the supplied 'type' value
 *
 * Response is in format { valid: false, errors: { title:"missing", age:"not integer" }}
 */
exports.validate = function(data, fields) {
    var i,
	errors = {};
    for(i=0; i<fields.length; i++) {
	var field = fields[i];
	if (data[field.name] === undefined) errors[field.name] = "Field is missing.";
	else {
	    var coerced = (field.coerce !== undefined) ? field.coerce(data[field.name]) : data[field.name];
	    if (field.type !== undefined && typeof(coerced) != field.type) errors[field.name] = "Expected "+field.type+" but found "+typeof(coerced);
	}
    }
    return {"errors":errors, "data":data};
}