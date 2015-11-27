function Convert(app, type, controllers, middlewares) {

  require("fs").readdirSync(controllers).forEach(function(file) {
    try {
      require.resolve(controllers + file);

      var controoller  = null,
          url          = "/" + file.split("_")[0],
          _require     = require(controllers + file);

      if (typeof _require == 'function')
        controller = new _require();
      else if (typeof _require == 'object')
        controller = _require;
      else
        console.log('[Type Error : Controller need be a Object/Function]');


      if (type == 'rest') {
        if (controller.findById) {app.get(url + "/:id", controller.findById); delete controller.findById}
        if (controller.find) {app.get(url, controller.find); delete controller.find};
        if (controller.create) {app.post(url, controller.create); delete controller.create}
        if (controller.update) {app.put(url + "/:id", controller.update);delete controller.update}
        if (controller.remove) {app.delete(url + "/:id", controller.remove); delete controller.remove}

        var keys = Object.keys(controller);

        if (keys.length > 0) {
          keys.forEach(function (k) {
            var kArr = k.split('_'),
                method = kArr[0].toLowerCase(),
                urlCom = kArr[1];

            app[method](url + "/" + urlCom, controller[k]);
          });
        }
      }

      if (type == 'mvc') {
        Object.keys(controller).forEach(function (k) {
          var kArr = k.split('_'),
              method = kArr[0].toLowerCase(),
              urlCom = kArr[1];

          app[method](url + "/" + urlCom, controller[k]);
        });
      }


    } catch (e) {
      console.log(e);
    }
  });

}

module.exports = Convert;
