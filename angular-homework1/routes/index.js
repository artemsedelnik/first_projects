module.exports = function (app){
    app.get('/', require('./home').get);
    app.get('/data', require('./data').get);
};