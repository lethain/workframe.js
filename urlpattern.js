var url = require("url");

exports.patterns = [];
exports.default_404 = function(req, res) {
    res.writeHead(404, {'Content-Type': 'text/html'});
    res.write('No matching pattern found');
    res.end();
}

exports.dispatch = function(req, res, data) {
    var path = url.parse(req.url).pathname,
	match,
	i;
    for(i=0; i<exports.patterns.length; i++) {
	var pattern = exports.patterns[i],
	    exec_resp = pattern[0].exec(path);
	if (exec_resp) {
	    match = pattern;
	    var params = [req, res].concat((match[0].exec(path)).slice(1), [data]);
	    match[1].apply(this, params);
	    break;
	}
    }
    if (!match) exports.default_404(req, res, data);
}

