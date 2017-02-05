const fs = require('fs');
var db = require('mongoskin').db('mongodb://localhost:27017/hamilton');


var collectionName = 'words';


var words = [];

var boringWords = [
    "A", "a", "I", "the", "The", "You", "you", "I'm", "and", "in", "of", "on", "to", "And", "it", "for", "be", "your", "but", "my", "we", "that", "is", "this", "you're" 
];

var files = [
    {act: 'Act1', number: '01', name: 'Alexander Hamilton' },
    {act: 'Act1', number: '02', name: 'Aaron Burr, Sir' },
    {act: 'Act1', number: '03', name: 'My Shot' },
    {act: 'Act1', number: '04', name: 'The Story Of Tonight' },
    {act: 'Act1', number: '05', name: 'The Schuyler Sisters' },
    {act: 'Act1', number: '06', name: 'Farmer Refuted' },
    {act: 'Act1', number: '07', name: 'You\'ll Be Back' },
    {act: 'Act1', number: '08', name: 'Right Hand Man' },
    {act: 'Act1', number: '09', name: 'A Winter\'s Ball' },
    {act: 'Act1', number: '10', name: 'Helpless' },
    {act: 'Act1', number: '11', name: 'Satisfied' },
    {act: 'Act1', number: '12', name: 'The Story Of Tonight (Reprise)' },
    {act: 'Act1', number: '13', name: 'Wait For It' },
    {act: 'Act1', number: '14', name: 'Stay Alive' },
    {act: 'Act1', number: '15', name: 'Ten Duel Commandments' },
    {act: 'Act1', number: '16', name: 'Meet Me Inside' },
    {act: 'Act1', number: '17', name: 'That Would Be Enough' },
    {act: 'Act1', number: '18', name: 'Guns And Ships' },
    {act: 'Act1', number: '19', name: 'History Has Its Eyes On You' },
    {act: 'Act1', number: '20', name: 'Yorktown (The World Turned Upside Down)' },
    {act: 'Act1', number: '21', name: 'What Comes Next' },
    {act: 'Act1', number: '22', name: 'Dear Theodosia' },
    {act: 'Act1', number: '23', name: 'Non Stop' },
    {act: 'Act2', number: '24', name: 'What\'d I Miss' },
    {act: 'Act2', number: '25', name: 'Cabinet Battle #1' },
    {act: 'Act2', number: '26', name: 'Take A Break' },
    {act: 'Act2', number: '27', name: 'Say Ni To This' },
    {act: 'Act2', number: '28', name: 'The Room Where It Happens' },
    {act: 'Act2', number: '29', name: 'Schuyler Defeated' },
    {act: 'Act2', number: '30', name: 'Cabinet Battle #2' },
    {act: 'Act2', number: '31', name: 'Washington On Your Side' },
    {act: 'Act2', number: '32', name: 'One Last Time' },
    {act: 'Act2', number: '33', name: 'I Know Him' },
    {act: 'Act2', number: '34', name: 'The Adams Administration' },
    {act: 'Act2', number: '35', name: 'We Know' },
    {act: 'Act2', number: '36', name: 'Hurricane' },
    {act: 'Act2', number: '37', name: 'The Reynolds Pamphlet' },
    {act: 'Act2', number: '38', name: 'Burn' },
    {act: 'Act2', number: '39', name: 'Blow Us All Away' },
    {act: 'Act2', number: '40', name: 'Stay Alive (Reprise)' },
    {act: 'Act2', number: '41', name: 'It\'s Quiet Uptown' },
    {act: 'Act2', number: '42', name: 'The Election Of 1800' },
    {act: 'Act2', number: '43', name: 'Your Obedient Servant' },
    {act: 'Act2', number: '44', name: 'Best Of Wives And Best Of Women' },
    {act: 'Act2', number: '45', name: 'The World Was Wide Enough' },
    {act: 'Act2', number: '46', name: 'Who Lives, Who Dies, Who Tells Your Story' },
];

function readFile(f) {
    
    var filename = f.act + '/' + f.number + f.name + '.txt';
    
    console.log('reading ' + filename);
    
    var fs = require('fs');
    var lines = fs.readFileSync(filename).toString().split("\n");
    var fileCloud = {};
    
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
                if (!fileCloud.hasOwnProperty(w)) {
                    fileCloud[w] = 0;
                }
                fileCloud[w] += w.length;    
            }
        })
    
    });
    
    
    var entry = {
        act: f.act,
        number: f.number,
        name: f.name,
        words: fileCloud
    }
    
    db.collection(collectionName).insert(entry, function(err, result) {
		if (err) throw err;
		if (result) {
            // 
		}
	});
    
    
    
}

//function getFiles(dirList, addFile) {
//	var files = [];
//    dirList.forEach(function(dir) {
//        var contents = fs.readdirSync(dir);
//        for (f of contents) {
//            var fullPath = dir + '/' + f;
//            var stats = fs.lstatSync(fullPath);
//            if (stats.isFile()) {
//                files.push(fullPath);
//
//            }
//        }
//    });
//	return files;
//}

//var handlerFunction = "";
//
//function convertCloud(cloud) {
//    var results = [];
//    for (var word in cloud) {
//        var weight = cloud[word];
//        results.push({
//            text: word,
//            weight: weight//,
//            //handlers: handlerFunction
//        }); 
//
//    }
//    return results;
//}
//
//cloud = {};

db.collection(collectionName).drop(function() {
    files.forEach(function(f) {
        readFile(f);
    });

    db.close();
    console.log('done reading files');
});



//var recycleBin = [];
//for (var word in cloud) {
//    var lc = word.toLowerCase();
//    if (word === lc || !cloud.hasOwnProperty(lc)) {
//        continue;
//    }
//    
//    var lcCount = cloud[lc];
//    
//    if (lcCount > cloud[word]) {
//        cloud[lc] += cloud[word];
//        recycleBin.push(word);
//    } else {
//        cloud[word] += lcCount;
//        recycleBin.push(lc);
//    }
//}
//console.log('done reconciling case conflicts');
//
//recycleBin.forEach(function(word) {
//   delete cloud[word]; 
//});
//console.log('done with recycling');
//
//var converted = convertCloud(cloud);
////converted.forEach(function(entry) {
////    console.log(entry.text + ': ' + entry.weight);
////})
//
//// convert "converted" to json
//var json = JSON.stringify(converted);
////console.log(json);
//
//fs.writeFile("wordCloud.json", json, function(err) {
//    if(err) {
//        return console.log(err);
//    }
//
//    console.log("The json file was saved!");
//}); 
