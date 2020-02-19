import { write, readFile } from "fs";

let fs = require('fs');

// Takes a path to a file and returns the entire contents of the file as a string
function read(path) {
    //onsole.log('Path');
    //console.log(typeof path);
    return [fs.readFileSync(path[0]).toString().split(",") , fs.readFileSync(path[1]).toString().split("")];
}

// Takes a string and returns a copy with all nonalphanumeric chars replaced by white space
function filterCharsAndNormalize(data: any[]) {
    for (let index = 0; index < data[1].length; index++) {
        if (isLetter(data[1][index])) {
            data[1][index] = data[1][index].toLowerCase();
        } else {
            data[1][index] = '';
        }
    }
    return data;
}

// Takes a string and scans for words, returning  a list of words.
function scan(data: any[]) {
    let word = "";
    let words = []
    for (let index = 0; index < data[1].length; index++) {
        if (isLetter(data[1][index]) && data[1][index] != "") {
            word += data[1][index];
        }
        else if (word != "") {
            words.push(word);
            word = "";
        }
    }
    return [data[0], words];
}

function isLetter(str: string): Boolean {
    return str.length === 1 && Boolean(str.match(/^[0-9a-zA-Z]+$/));
}

// Takes a list of words and returns a copy with all stop words removed
function removeStopWords(data: any[]) {
    let stopWords = data[0];
    let modifiedData = []

    for (let index = 0; index < data[1].length; index++) {
        if (!stopWords.includes(data[1][index])) {
            modifiedData.push(data[1][index]);
        }
    }
    return modifiedData;
}

// Takes a list of words and returns a dictionary associating words with frequencies of occurrence
function frequancies(words: string[]) {
    let words_count: [string, number][] = [];

    for (let word in words) {
        let found = false
        for (var index = 0; index < words_count.length; index++) {
            if (words[word] == words_count[index][0]) {
                words_count[index][1] += 1;
                found = true
            }
        }
        if (!found) {
            words_count.push([words[word], 1]);
        }
    }
    return words_count;
}

/*
    Takes a dictionary of words and their frequencies
    and returns a list of pairs where the entries are
    sorted by frequency
 */
function sort(words_count: [string, number][]) {
    words_count.sort((a, b) => {
        return b[1] - a[1];
    });
    return words_count;
}

// Takes a list of pairs where the entries are sorted by frequency and print them recursively.
function printAll(count_word) {
    console.log(count_word);
}

// The main function
function main() {
    let count_word = sort(frequancies(removeStopWords(scan(filterCharsAndNormalize(read(['../data\\stop_words.txt', '../data\\dummy_data.txt']))))));
    for (let index = 0; index < count_word.length && index < 25; index++) {
        printAll(count_word[index]);
    }
}

main();