module.exports = function (middlewares, controllers) {
  if (!middlewares) return {};

  var fs          = require('fs'),
      middleDIR   = fs.readdirSync(middlewares),
      controllers = controllers.map(function (c) { return c.split('_')[0];}),
      globalMid   = middleDIR.filter(function (f){return f.indexOf(".js") > -1}),
      localMid    = middleDIR.filter(function (f){return f.indexOf(".js") < 0}),
      globalLoadedMiddlewares = {};

  controllers.forEach(function (c) {
    globalLoadedMiddlewares[c] = {all:[], get:[], post:[], put:[], delete:[]};
  });

  localMid.forEach(function (file) {
    var name = file.split("_")[0];
    fs.readdirSync(middlewares + file).forEach(function (js) {
      //Start Try
      try {
        require.resolve(middlewares + file + "/" + js);
        var mid  = require(middlewares + file + "/" + js);


        if (typeof mid == 'function') {
          globalLoadedMiddlewares[name].all.push(mid);
        } else if (typeof mid == 'object') {
          if (mid.include) {
            mid.include.forEach(function(method) {
              globalLoadedMiddlewares[name][method].push(mid.fn);
            });
          } else if (mid.exclude) {
            Object.keys(globalLoadedMiddlewares[name]).forEach(function (k) {
              if (mid.exclude.indexOf(k) > -1 || mid.exclude.indexOf(k.toUpperCase()) > -1)
                globalLoadedMiddlewares[name][k] = mid.fn;
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
  });

  globalMid.forEach(function (file) {
    try {
      require.resolve(middlewares + file);
      var mid = require(middlewares + file);

      if (typeof mid == 'function') {
        app.use(mid);
      } else if (typeof mid == 'object') {
        if (mid.include) {
          mid.include.forEach(function (k) {
            k.methods.forEach(function(m){
              globalLoadedMiddlewares[k.controller][m.toLowerCase()].push(mid.fn);
            });
          });
        } else if (mid.exclude) {
          mid.exclude.forEach(function (o) {
            ['GET','POST','PUT','DELETE'].forEach(function (m) {
              if (o.methods.indexOf(m) === -1)
                globalLoadedMiddlewares[o.controller][m.toLowerCase()] = mid.fn;
            });
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
  });

  return globalLoadedMiddlewares;
};
