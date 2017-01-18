const fs = require('fs');

var words = [];

var boringWords = [
    "A", "a", "I", "the", "The", "You", "you", "I'm", "and", "in", "of", "on", "to", "And", "it", "for", "be", "your", "but", "my", "we"
];

function readFile(f, cloud) {
    console.log('reading ' + f);
    
    var fs = require('fs');
    var lines = fs.readFileSync(f).toString().split("\n");

    lines.forEach(function(line) {
        if (/^\s*$/.test(line)) {
            return;
        }    
        if (/\[.*\]\s*/.test(line)) {
            return;
        }
        if (/\(.*\)\s*/.test(line)) {
            return;
        }
        var words = line.split(/\s+/);
        
        words.forEach(function(w) {
            // Punctuation not including apostrophe
            w = w.replace(/[,\?!:\."…“”-]/g, '');

            //replace that weird apostrophe with the normal one
            w = w.replace('’', '\'');
            w = w.replace('�', '\'');
            // Extra square brackets
            if (/^\[/.test(w)) {
                return;    
            }
            if (/\]$/.test(w)) {
                return;
            }    
            if (/\[.*\]\s*/.test(w)) {
                return;
            }
            //removing leading and trailing spaces
            w = w.replace(/^\s*/, '');
            w = w.replace(/\s*$/, '');
            
            //removing trailing dash thing that is a piece of shit
            w = w.replace(/—$/, '');
            
            //removing apostrophes
            w = w.replace(/^'/, '');
            w = w.replace(/'$/, '');
            
            if (boringWords.includes(w)){
                return;
            }
            
            if (!/^\s*$/.test(w)) {
                if (!cloud.hasOwnProperty(w)) {
                    cloud[w] = 0;
                }
                cloud[w]++;    
            }
        })
    
    });
}

function getFiles(dirList, addFile) {
	var files = [];
    dirList.forEach(function(dir) {
        var contents = fs.readdirSync(dir);
        for (f of contents) {
            var fullPath = dir + '/' + f;
            var stats = fs.lstatSync(fullPath);
            if (stats.isFile()) {
                files.push(fullPath);

            }
        }
    });
	return files;
}

var handlerFunction = "";

function convertCloud(cloud) {
    var results = [];
    for (var word in cloud) {
        var weight = cloud[word];
        results.push({
            text: word,
            weight: weight//,
            //handlers: handlerFunction
        }); 

    }
    return results;
}

var files = getFiles([
  'Act1'
  //, 'Act2'
]);

cloud = {};
files.forEach(function(f) {
    readFile(f, cloud);
});
console.log('done reading files');

var recycleBin = [];
for (var word in cloud) {
    var lc = word.toLowerCase();
    if (word === lc || !cloud.hasOwnProperty(lc)) {
        continue;
    }
    
    var lcCount = cloud[lc];
    
    if (lcCount > cloud[word]) {
        cloud[lc] += cloud[word];
        recycleBin.push(word);
    } else {
        cloud[word] += lcCount;
        recycleBin.push(lc);
    }
}
console.log('done reconciling case conflicts');

recycleBin.forEach(function(word) {
   delete cloud[word]; 
});
console.log('done with recycling');

var converted = convertCloud(cloud);
//converted.forEach(function(entry) {
//    console.log(entry.text + ': ' + entry.weight);
//})

// convert "converted" to json
var json = JSON.stringify(converted);
//console.log(json);

fs.writeFile("wordCloud.json", json, function(err) {
    if(err) {
        return console.log(err);
    }

    console.log("The json file was saved!");
}); 
