exports.run = function(funs, ctx, params) {
    if (params === undefined) params = [];
    if (funs && funs[0]) 
	funs[0].apply(this, [funs.slice(1), ctx].concat(params));
}