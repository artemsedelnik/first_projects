/**
 * Created by Sedelnik on 26.07.15.
 */
var fs = require('fs');
exports.get = function(req, res){

        fs.readFile('index.html', function(err, contents) {
            if(!err) {
                res.setHeader("Content-Length", contents.length);
                //res.setHeader("Content-Type", mimeType);
                res.statusCode = 200;
                res.end(contents);
            } else {
                res.writeHead(500);
                res.end();
            }
        });

};