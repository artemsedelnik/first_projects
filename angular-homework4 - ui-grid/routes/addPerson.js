/**
 * Created by ArtemSedelnik on 23.09.15.
 */

var fs = require('fs');

exports.post = function(req, res){
    var persons = JSON.parse(fs.readFileSync('data/sampleJSON.json', 'utf8'));
    var newPerson = req.body;
    if (!newPerson)
        res.sendStatus(500);
    persons.push(newPerson);
    fs.writeFile('data/sampleJSON.json', JSON.stringify(persons, null, 4), function(err) {
        if(err) {
            console.log(err);
            res.sendStatus(500);
        } else {
            console.log("Person added");
            res.end();
        }
    });
};