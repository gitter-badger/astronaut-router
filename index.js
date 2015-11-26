function argsGetter() {
  var path        = __filename.split('/node_modules/')[0],
      astronaut   = require(path + '/astronaut.js'),
      controllers = path + '/' + astronaut.controllers + "/",
      middlewares = path + '/' + astronaut.middlewares + "/",
      config      = path + '/' + astronaut.configs + "/";

  return {
    path        : path,
    astronaut   : astronaut,
    controllers : controllers,
    middlewares : middlewares,
    config      : config
  };
}

function Route(app) {
  var args = argsGetter();
  require('./bin/rest')(app, args.config, args.controllers, args.middlewares);
}

module.exports = {attach : Route};
