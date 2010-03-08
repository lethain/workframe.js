
* [overview](#overview)
* [workflow.js](#workflow)
    * [existing workflow segments](#workflow-existing)
* [urlpattern.js](#urlpattern)
    * [example](#urlpattern-example)
    * [fall-through response / default response](#urlpattern-default)
* [forms.js](#forms)

## ``workframe.js`` <a name="overview"></a> 

``workframe.js`` is a nascient [Node.js][node.js] micro-framework, which really means its just
a collection of simple utilities and ideas with the aim of making it easier to
develop complicated applications on [Node.js][node.js]. In particular it aims to solve
the problems of

* url dispatch
* managing deeply-nested callbacks

[node.js]: http://nodejs.org/ "Node.js documentation"

## ``workflow.js`` <a name="workflow"></a> 

``workflow.js`` is the combination of a simple tool and a simple convention which together make it
possible to write imperative workflows in Node.js, which makes it possible to describe, modify and
maintain complicated workflows whose underlying implementation relies on callbacks.

Workflows are composed of one or more segments. Some example segments are sending an HTTP response
to a client, rendering a Mustache template, or generating a new unique identifier in Redis.

Workflows are defined and started like this (usually the ``index`` function would be called by
the ``urlpattern.js`` dispatcher, but there isn't any programmatic coupling whatsoever):

    exports.index = function(req, res) {
        var ctx = {req:req, res:res, template:"index", title:"Home"
        workflow.run([redis.ids, redis.mget, utils.render_template, utils.http_response], ctx, ["user.projects"]);
    }

Where each workflow segment is a function which looks like this:

    exports.http_redirect = function(funs, ctx, location) {
        if (location === undefined) location = ctx.redirect;
        ctx.res.writeHead(303, {"Location":location});
        ctx.res.close();
        workflow.run(funs, ctx);
    }

More examples at ``segments/``. (Well, they will be there soon, anyway.)

## Existing Workflow Segments <a name="workflow-existing"></a>

These will be coming over the next few days.


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

## Fall-Through Response / Default Response <a name="urlpattern-default"></a> 

In addition to defining patterns for dispatch, it is also possible to override the
default page (to throw a custom 404 page, etc) by updating the value of ``urlpattern.default_404``.

A valid ``default_404`` function will look like this:

    urlpatterns.default_404 = function(req, res) {
        res.writeHead(404, {'Content-Type': 'text/html'});
        res.write('No matching pattern found');
        res.close();
    }


## ``forms.js`` <a name="forms"></a> 

The forms stuff is really really young and experimental and
will undoubtedly change as I keep working with it.

Relies on the ``forms.validate`` function which takes a dictionary
of raw data (probably from ``querystring.parse``, but could be from
anywhere) and a form schema.

Form schemas are very simple, and look like this:

    [{name:"title"}, {name:"age", type:"number", coerce:parseInt}]

``coerce`` can be any function with an arity of one, and ``type`` can be
any value returned by the ``typeof`` function.

``forms.validate`` returns a dictionary with two values ``errors`` and ``data``.
``data`` is the input data passed through any coerce functions and ``errors`` is
a dictionary where the key is the name of the field with an error and the value is
a specific error message.

