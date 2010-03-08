
* [overview](#overview)
* [workflow.js](#workflow)
    * [existing workflow segments](#workflow-existing)
* [urlpattern.js](#urlpattern)
    * [example](#urlpattern-example)
    * [fall-through response / default response](#urlpattern-default)

## ``workframe.js`` <a name="overview"></a> 

``workframe.js`` is a nascient [Node.js][node.js] micro-framework, which really means its just
a collection of simple utilities and ideas with the aim of making it easier to
develop complicated applications on [Node.js][node.js]. In particular it aims to solve
the problems of

* url dispatch
* managing deeply-nested callbacks

[node.js]: http://nodejs.org/ "Node.js documentation"

## ``workflow.js`` <a name="workflow"></a> 

Coming soon.

* make it possible to develop and maintain relatively complex node.js apps without blowing your mind
* define workflow segments which asynchronously do some unit of work
* workflows to which connect one segment with another while masking
    the developer from the inevitable nested callbacks

## Existing Workflow Segments <a name="workflow-existing"></a> 

* utilities
    * I happen to be using Mu (which uses Mustache), so will have some utilities for rendering via Mu
    * I happen to be using Redis, so some utilities along this way as well


## ``urlpattern.js`` <a name="urlpattern"></a> 

``urlpattern.js`` is a utility for doing regular expression based url dispatching.
It is modeled very closely off the Django file by the same name.
A simple example (which assumes ``workframe.js`` is checked out at ``../workframe.js``
relative to the ``my_project.js`` file).

## ``urlpattern.js`` example <a name="urlpattern-example"></a> 

    // my_project.js
    var http = require("http"),
        views = require("./views"),
        urlpattern = require("../workframe.js/urlpattern");

    urlpattern.patterns = [
        [/^\/project\/view\/([\w-_]+)\/$/, views.view_project],
        [/^\/$/, views.index]
    ];

    http.createServer(function(req, res) {
        // if you aren't interested in capturing any
        // incoming data, then you can remove the data
        // variable and also the data listener and
        // use urlpattern.dispatch(req, res) instead
        var data = "";
        req.addListener('data', function(chunk) {
            data += chunk;
        }
        req.addListener('end', function() {
        	urlpattern.dispatch(req, res, data);
        });
    }).listen(8000);

    // views.js
    // 'data' is optional parameter, well, all parameters in JS are
    // optional, but usually you don't want it, especially if you
    // remove the data listener in your HTTP server
    exports.index = function(req, res, data) {
        res.writeHead(200, {'Content-Type': "text/html"});
        res.write("this is index.html");
        res.close();
    }

    // this could also be declared as
    //     exports.view_project = function(req, res, project_name) {
    exports.view_project = function(req, res, project_name, data) {
        res.writeHead(200, {'Content-Type': "text/html"});
        res.write("this is view_project.html for project with name "+project_name);
        res.close();
    }

## Fall-Through Response / Default Response <a name="urlpattern-default></a> 

<h3 id="urlpattern-default">Response When No Urlpattern Matches</h3>

In addition to defining patterns for dispatch, it is also possible to override the
default page (to throw a custom 404 page, etc) by updating the value of ``urlpattern.default_404``.

A valid ``default_404`` function will look like this:

    urlpatterns.default_404 = function(req, res) {
        res.writeHead(404, {'Content-Type': 'text/html'});
        res.write('No matching pattern found');
        res.close();
    }

