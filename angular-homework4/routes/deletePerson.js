/**
 * Created by ArtemSedelnik on 23.09.15.
 */
var fs = require('fs');

exports.post = function(req, res){
    var persons = JSON.parse(fs.readFileSync('data/sampleJSON.json', 'utf8'));
    var deletedPerson = req.body;
    //var deletedPersonIndex = persons.indexOf(deletedPerson);
    var deletedPersonIndex = -1;

    for (var i = 0; i < persons.length; i++){
        if (persons[i].id == deletedPerson.id) {
            deletedPersonIndex = i;
            persons.splice(deletedPersonIndex, 1);
            fs.writeFile('data/sampleJSON.json', JSON.stringify(persons, null, 4), function(err) {
                if(err) {
                    console.log(err);
                    res.sendStatus(500);
                } else {
                    console.log("Person deleted");
                    res.end();
                }
            });
            break;
        }
    }

    if (deletedPersonIndex < 0)
        res.sendStatus(500);
};