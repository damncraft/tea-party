module.exports = function(application) {
  var modules = application.get('modules');
  var Log = application.get('logger')();
  var Root = modules.express();
  
  Log('Load Root Config');
  require('./config')(Root, application);
  
  // ==== Load Root Routers
  var routers = [
    'RootRouter'
  ];
  for(routerIndex in routers) {
    var router = routers[routerIndex];
    Root.use(require('./routers/'+router)(Root, application));
  }
  
  // ==== Root 404 Error Handler
  Root.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
  });
  
  // ==== Root 500 Error Handler
  Root.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: (application.get('env') == 'development') ? err : {}
    });
  });
  
  // ==== Load Root into Application
  application.use('/', Root);
};