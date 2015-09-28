/**
 * Created by Sedelnik on 19.09.15.
 */
var fs = require('fs');

exports.post = function(req, res){
    var persons = JSON.parse(fs.readFileSync('data/sampleJSON.json', 'utf8'));
    var newPersonData = req.body;
    var editingPersonId = newPersonData.id;
    for (var i = 0; i < persons.length; i++){
        if (persons[i].id == editingPersonId){
            persons[i] = newPersonData;
            fs.writeFile('data/sampleJSON.json', JSON.stringify(persons, null, 4), function(err) {
                if(err) {
                    console.log(err);
                    res.sendStatus(500);
                } else {
                    console.log("Person edited");
                    res.end();
                }
            });
            break;
        }
    }
};