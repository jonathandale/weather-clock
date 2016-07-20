var express = require('express'),
    routes = require('./routes'),
    forecast = require('./routes/forecast'),
    path = require('path'),
    app = express();

//Configure app
app.configure(function(){
  app.use(function(req, res, next){
    res.locals.env = app.get('env');
    res.locals.version = '0.0.1';
    res.locals.appName = 'nimbus';
    next();
  });
  app.set('port', process.env.PORT || 9090);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.bodyParser());
  app.use(app.router);
  app.locals.pretty = false;
});

//Configure development mode
app.configure('development', function(){
  app.use(express.errorHandler());
  app.use(express.static(path.join(__dirname, 'public')));
});

//Configure production mode
app.configure('production', function(){

  app.use(express.static(path.join(__dirname, 'release')));

  // Start the server
  app.listen(app.get('port'), function() {
    console.log('\033[32mApp started on port '+app.get('port')+' in '+app.get('env')+' mode. \033[0m');
  });
});

//Configure routes
app.get('/', routes.index);
app.get('/forecast', forecast.index);

//Export for use by grunt
module.exports = app;