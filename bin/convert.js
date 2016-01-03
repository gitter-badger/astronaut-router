function Convert(app, type, controllers, middlewares, prefix) {
  var fs = require("fs");

  try {
    fs.readdir(controllers, readdirCallback);
  } catch (e) {
    console.log("[DECLARATION PATH ERROR] The path to the controllers doesn't exist, verify your astronaut.js");
    process.exit(0);
  }
  /**
   * This function MAP the routes by filess
   */
  function readdirCallback(err, controllerfiles) {
    if (err) {
      console.log('[NATIVE ERR]', err);
      process.exit(0);
    }

    var globalLoadedMiddlewares = require('./middle_convert')(middlewares, controllerfiles);

    controllerfiles.forEach(function(file) {
      try {
        require.resolve(controllers + file);

        var controller   = null,
            __name       = file.split("_")[0],
            url          = "/" + (prefix ? prefix + "/" : "") + __name,
            _require     = require(controllers + file),
            mid          = globalLoadedMiddlewares[__name] ? globalLoadedMiddlewares[__name] : {get:[], post:[], put:[], delete:[]};

        if (typeof _require == 'function')
          controller = new _require();
        else if (typeof _require == 'object')
          controller = _require;
        else
          console.log('[Type Error : Controller need be a Object/Function]');

        if (mid.all)
          app.all(url, mid.all);

        if (controller.ControllerName) {
          url = url.replace(__name, controller.ControllerName);
          delete controller.ControllerName;
        }

        if (type == 'rest') {
          if (controller.findById) {app.get(url + "/:id", mid.get, controller.findById); delete controller.findById}
          if (controller.find) {app.get(url, mid.get, controller.find); delete controller.find};
          if (controller.create) {app.post(url, mid.post, controller.create); delete controller.create}
          if (controller.update) {app.put(url + "/:id", mid.put, controller.update);delete controller.update}
          if (controller.remove) {app.delete(url + "/:id", mid.delete, controller.remove); delete controller.remove}

          var keys = Object.keys(controller);

          if (keys.length > 0) {
            keys.forEach(function (k) {
              var kArr = k.split('_'),
                  method = kArr[0].toLowerCase(),
                  urlCom = kArr[1];

              app[method](url + "/" + urlCom, mid[method], controller[k]);
            });
          }
        }

        if (type == 'mvc') {
          Object.keys(controller).forEach(function (k) {
            var kArr = k.split('_'),
                method = kArr[0].toLowerCase(),
                urlCom = kArr[1];

            app[method](url + "/" + urlCom, mid[method], controller[k]);
          });
        }


      } catch (e) {
        console.log(e);
      }
    });
  }
}

module.exports = Convert;
