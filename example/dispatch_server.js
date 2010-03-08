var http = require("http"),
    urlpattern = require("../urlpattern");

var index = function(req, res) {
    res.writeHead(200, {'Content-Type': "text/html"});
    res.write("this is index.html");
    res.close();
}

var project = function(req, res, name) {
    res.writeHead(200, {'Content-Type': "text/html"});
    res.write("This is Project: " + name);
    res.close();   
}

urlpattern.patterns = [
    [/^\/project\/([\w-_]+)\/$/, project],
    [/^\/$/, index]
];

http.createServer(function(req, res) {
    req.addListener('end', function() {
	urlpattern.dispatch(req, res);
    });
}).listen(8000);
