function rest(app, config, controllers, middlewares) {

  try {
    require.resolve(config + 'MainConfig');
    require.resolve(config + 'RouteConfig');

    var routes  = require(config + 'RouteConfig'),
        main    = require(config + 'MainConfig');

    main.apiPrefix = !main.apiPrefix ? main.apiPrefix = '/api/' : '/' + main.apiPrefix + '/';

    routes.forEach(function (r) {
      var url    = main.apiPrefix + r.url, controller,
          middle = require('./middle')(app, url, r.middlewares, middlewares);

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

      if (controller.findById) app.get(url + "/:id", middle.get , controller.findById);
      if (controller.find) app.get(url, middle.get, controller.find);
      if (controller.create) app.post(url, middle.post , controller.create);
      if (controller.update) app.put(url + "/:id", middle.put , controller.update);
      if (controller.remove) app.delete(url + "/:id", middle.remove , controller.remove);
    });
  } catch (e) {
    console.log(e);
  }
}

module.exports = rest;
