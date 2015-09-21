/**
 * Created by ArtemSedelnik on 11.09.15.
 */
var fs = require('fs');
exports.get = function(req, res, next) {
    var persons = JSON.parse(fs.readFileSync('data/sampleJSON.json', 'utf8'));
    res.send(persons);
};