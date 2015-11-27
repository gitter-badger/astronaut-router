function Convert(app, type, controllers, middlewares) {
  var fs = require("fs"),
      globalLoadedMiddlewares = {};

  /**
   * This function register global middlewares, and construct middleObject
   */
  fs.readdirSync(middlewares).forEach(function (file) {
    if (file.indexOf(".js") > -1) {
      //Start Try
      try {
        require.resolve(middlewares + file);
        var mid = require(middlewares + file);

        if (typeof mid == 'function') {
          app.use(mid);
        } else if (typeof mid == 'object') {

        } else {
          console.log('[Type Error : Middleware need be a Object/Function]');
        }
      } catch (e) {
        console.log(e);
      }
      //End Try
    } else {
      globalLoadedMiddlewares[file] = {all:[], get:[], post:[], put:[], delete:[]};
      fs.readdirSync(middlewares + file).forEach(function (js) {
        //Start Try
        try {
          require.resolve(middlewares + file + "/" + js);
          var mid = require(middlewares + file + "/" + js);

          if (typeof mid == 'function') {
            globalLoadedMiddlewares[file].all.push(mid);
          } else if (typeof mid == 'object') {
            if (mid.include) {
              mid.include.forEach(function(method) {
                globalLoadedMiddlewares[file][method].push(mid.fn);
              });
            } else if (mid.exclude) {
              Object.keys(globalLoadedMiddlewares[file]).forEach(function (k) {
                if (mid.exclude.indexOf(k) || mid.exclude.indexOf(k.toUpperCase()))
                  globalLoadedMiddlewares[file][k] = mid.fn;
              });
            } else {
              console.log("[Miss Error : You need put a property exclude or include in Object Middlewares]");
            }
          } else {
            console.log('[Type Error : Middleware need be a Object/Function]');
          }
        } catch (e) {
          console.log(e);
        }
        //End Try
      });
    }
  });

  /**
   * This function MAP the routes by filess
   */
  fs.readdirSync(controllers).forEach(function(file) {
    try {
      require.resolve(controllers + file);

      var controller   = null,
          __name       = file.split("_")[0],
          url          = "/" + __name,
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

module.exports = Convert;
