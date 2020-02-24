import { writeFile } from 'fs';

let fs = require('fs');
var assert = require('assert');

function extractWords(path: string) {
    assert(path != "", "Empty path")
    return fs.readFileSync(path).toString().replace(/[\W_|]+/gi, " ").split(" ");
}

function removeStopWords(words: string[]) {
    assert(words != [], "I need words to process");
    let stopwords;
    stopwords = fs.readFileSync('../data\\stop_words.txt').toString().split(",");

    let newWords = [];
    for (let word in words) {
        if (!stopwords.includes(words[word])) {
            newWords.push(words[word]);
        }
    }
    return newWords;
}

function frequancies(words: string[]) {
    assert(words != [], "Empty list")
    let words_count: [string, number][] = [];

    for (let word in words) {
        let found = false
        for (var i = 0; i < words_count.length; i++) {
            if (words[word] == words_count[i][0]) {
                words_count[i][1] += 1;
                found = true
            }
        }
        if (!found) {
            words_count.push([words[word], 1]);
        }
    }
    return words_count;
}

function sort(words_count: [string, number][]) {
    if (words_count == []) {
        return [];
    }
    words_count.sort((a, b) => {
        return b[1] - a[1];
    });
    return words_count;
}

function main(filePath: string) {
    try {
        let count_word = sort(frequancies(removeStopWords(extractWords(filePath))));
        assert!((count_word instanceof Array), "Not an array")
        for (let index = 0; index < count_word.length && index < 25; index++) {
            console.log(count_word[index]);
        }
    }
    catch{
        console.log("Error has occured");
    }
}

//main();

//This is a valid test it will run 
console.log('Valid file');
main('../data\\dummy_data.txt');

//This is not a valid test it will produce an error 
console.log('Invalid file');
main('../data\\file.txt');

//Empty file will result the assert to stop the execution 
main('');

