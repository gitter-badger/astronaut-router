function argsGetter() {
  var path        = __filename.split('/node_modules/')[0],
      astronaut   = require(path + '/astronaut.js'),
      controllers = astronaut.controllers ? path + '/' + astronaut.controllers + "/" : null,
      middlewares = astronaut.middlewares ? path + '/' + astronaut.middlewares + "/" : null,
      config      = astronaut.configs ? path + '/' + astronaut.configs + "/" : null;

  return {
    path        : path,
    astronaut   : astronaut,
    controllers : controllers,
    middlewares : middlewares,
    config      : config
  };
}

function Config(app) {
  var args = argsGetter();
  require('./bin/config')(app, args.config, args.controllers, args.middlewares);
}

function Convert(app, type) {
  var args = argsGetter();
  if (!type) console.log("[TypeError: No type declared in Convert Router]");
  require('./bin/convert')(app, type, args.controllers, args.middlewares);
}

module.exports = {
  byConfiguration : Config,
  byConvertion : Convert
};
