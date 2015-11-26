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

      if (controller.findById || r.mapping.findById)
        app.get(url + "/:id", middle.get , controller.findById ? controller.findById : controller[r.mapping.findById]);

      if (controller.find || r.mapping.find)
        app.get(url, middle.get, controller.find ? controller.find : controller[r.mapping.find]);

      if (controller.create || r.mapping.create)
        app.post(url, middle.post , controller.create ? controller.create : controller[r.mapping.create]);

      if (controller.update || r.mapping.update)
        app.put(url + "/:id", middle.put , controller.update ? controller.update : controller[r.mapping.update]);

      if (controller.remove || r.mapping.remove)
        app.delete(url + "/:id", middle.remove , controller.remove ? controller.remove : controller[r.mapping.remove]);
    });
  } catch (e) {
    console.log(e);
  }
}

module.exports = rest;
