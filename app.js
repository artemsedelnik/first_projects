var express = require('express');
var http = require('http');
var path = require('path');
var config = require('./config');
var session = require('express-session');

var app = express();
app.set('port', config.get('port'));

app.use(session({
    secret: config.get('session:secret'),
    key: config.get('session:key'),
    cookie: config.get('session:cookie')
}));

require('./routes')(app);
app.use(express.static(path.join(__dirname, 'public')));


http.createServer(app).listen(config.get('port'), function(){
    console.log('Express server listening on port ' + config.get('port'));
});


app.use(function(req, res, next){
    /*var err = new HttpError(404, 'Page not found');
    res.sendHttpError(err);*/
});