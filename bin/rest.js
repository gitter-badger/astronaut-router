function nonAuth(req, res, next) {
  next();
}

function rest(app, config, controllers) {
  try {
    require.resolve(config + 'MainConfig');
    require.resolve(config + 'RouteConfig');

    var routes  = require(config + 'RouteConfig'),
        main    = require(config + 'MainConfig');

    main.apiPrefix = !main.apiPrefix ? main.apiPrefix = '/api/' : '/' + main.apiPrefix + '/';

    routes.forEach(function (r) {
      var url = main.apiPrefix + r.url, controller;

      if (main.gerericController && !r.controller) {
        if (!r.args)
          controller = require(controllers + main.gerericController);
        else
          controller = require(controllers + main.gerericController)(r.args);
      } else if (r.controller) {
        controller = require(controllers + r.controller);
      } else {
        console.log('Error on Controller Configuration');
      }


      if (controller.findById) app.get(url + "/:id", nonAuth , controller.findById);
      if (controller.find) app.get(url, nonAuth, controller.find);
      if (controller.create) app.post(url, nonAuth , controller.create);
      if (controller.update) app.put(url + "/:id", nonAuth , controller.update);
      if (controller.remove) app.delete(url + "/:id", nonAuth , controller.remove);
      if (controller.middleware) app.all(url, nonAuth , controller.middleware);
    });
  } catch (e) {
    console.log(e);
  }
}

module.exports = rest;
