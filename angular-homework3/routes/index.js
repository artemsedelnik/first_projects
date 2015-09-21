module.exports = function (app){
    app.get('/', require('./home').get);
    app.get('/data', require('./data').get);
    app.post('/updatePerson', require('./updatePerson').post);
    app.get('/favicon.ico', function(req, res){
        res.end();
    })
};