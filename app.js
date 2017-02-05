var express = require('express')
var app = express()

app.use(express.static('public'));

var db = require('mongoskin').db('mongodb://localhost:27017/hamilton');
db.bind('words');

app.get('/getCloud', function (req, res) {
    
    var data = db.words.find({"number": { "$in" : req.query.songs.split(',')} }).toArray(function(err, results) {
        if (err) {
            console.log("ERRROR");
            console.log(err);
            return;
        }
        
        
        
        var allWords = {};
        results.forEach(function(act) {
            var words = act.words;
            for (var word in words) { 
               if (words.hasOwnProperty(word)) {
                   if (!allWords.hasOwnProperty(word)) {
                       allWords[word] = 0;
                   }
                   allWords[word] += words[word];
               }
            }    
        });
                
        data = [];                
        for (var word in allWords) {
            if (allWords.hasOwnProperty(word)) {
                data.push({
                    text: word,
                    weight: allWords[word]
                });
            }
        }
        
        res.send(data);
    });
})

app.listen(3000, function () {
    console.log('Listening on port 3000');
});