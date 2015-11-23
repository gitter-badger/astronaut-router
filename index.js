function argsGetter() {
  var path        = __filename.split('/node_modules/')[0],
      astronaut   = require(path + '/astronaut.js'),
      controllers = path + '/' + astronaut.controllers + "/",
      config      = path + '/' + astronaut.configs + "/";

  return {
    path        : path,
    astronaut   : astronaut,
    controllers : controllers,
    config      : config
  };
}

function Rest(app) {
  var args = argsGetter();
  require('./bin/rest')(app, args.config, args.controllers);
}

function Mvc(app) {
  var args = argsGetter();
  require('./bin/mvc')(app, args.config, args.controllers);
}

module.exports = {
  rest : Rest,
  mvc  : Mvc
};
