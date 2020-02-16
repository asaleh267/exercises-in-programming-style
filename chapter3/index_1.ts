let fs = require('fs');

// the global list of [word, frequency] pairs
let word_freq: [string, number][] = [];
// read files for stop words and dummy data
let stop_words = fs.readFileSync('../data\\stop_words.txt').toString().split(',');
let fileLines = fs.readFileSync('../data\\dummy_data.txt').toString().split('\n');
// define start_word, end_word
let start_word = undefined, end_word;

let found: Boolean;

// iterate through the file one line at a time 

for (var line in fileLines) {
    for (var index = 0; index < fileLines[line].length; index++) {
        if (start_word == undefined) {
            if (Boolean(fileLines[line].charAt(index).match(/^[0-9a-zA-Z]+$/))) {
                // We found the start of a word
                start_word = index;
            }
        } else if (!Boolean(fileLines[line].charAt(index).match(/^[0-9a-zA-Z]+$/))) {
            // We found the end of a word. Process it
            end_word = index;
            found = false;
            var index2;
            let word = fileLines[line].substring(start_word, end_word);
            start_word = undefined;
            if (!(word in stop_words) && word.length > 2) {
                // Let's see if it already exists
                for (index2 = 0; index2 < word_freq.length; index2++) {
                    if (word_freq[index2][0] == word) {
                        found = true;
                        word_freq[index2][1] += 1;
                        break;
                    }
                }
                if (!found)
                    word_freq.push([word, 1]);
                else if (word_freq.length > 1) {
                    for (var i = index2 - 1; i >= 0; i--) {
                        if (word_freq[i][1] < word_freq[index2][1]) {
                            // swap
                            var temp = word_freq[i];
                            word_freq[i] = word_freq[index2];
                            word_freq[index2] = temp;
                            index2 = i;
                        }
                    }
                }
            }
        }
    }
}


for (var index = 0; index < word_freq.length && index < 25; index++) {
    console.log(word_freq[index]);
}