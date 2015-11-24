module.exports = function (app, url, middlewares, path) {
  if (middlewares) {
    if (middlewares.length && middlewares.length > 0) {

      var allMid = middlewares.map(function (m) {
        try {
          require.resolve(path + m);
          return require(path + m);
        } catch (e) {
          console.log("Erro", e);
        }
      });

      app.all(url, allMid);
      return {get : [], post : [], put : [], delete : []};
    }

    var mids = {get : [], post : [], put : [], delete : []};

    Object.keys(middlewares).forEach(function (k) {
      mids[k] = middlewares[k].map(function (m) {
        return require(path + m);
      });
    });

    return mids;
  }
};
