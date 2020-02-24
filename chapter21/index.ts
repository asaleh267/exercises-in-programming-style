import { write, readFile } from "fs";

let fs = require('fs');
var  assert = require('assert');


function extractWords(path: string) {
    assert(path != "", "Empty path");
    try {
        return fs.readFileSync(path).toString().replace(/[\W_|]+/gi, " ").split(" ");
    } catch{
        console.log("Error in opening the file.");
        return [];
    }
}

function removeStopWords(words: string[]) {

    assert(words != [], "No stop words, please provide stop words inorder to continue the process");
    let stopwords;
    try {
        stopwords = fs.readFileSync('../data\\stop_words.txt').toString().split(",");
    } catch{
        console.log("Error in opening the file.");
        return words;
    }
    let newWords = []
    for (let word in words) {
        if (!stopwords.includes(words[word])) {
            newWords.push(words[word]);
        }
    }
    return newWords;
}

function frequancies(words: string[]) {
    assert(words != [], "No list provided");
    let words_count: [string, number][] = [];

    for (let word in words) {
        let found = false
        for (var index = 0; index < words_count.length; index++) {
            if (words[word] == words_count[index][0]) {
                words_count[index][1] += 1;
                found = true;
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

function main() {
  let count_word = sort(frequancies(removeStopWords(extractWords('../data\\dummy_data.txt'))));
    // let count_word = sort(frequancies(removeStopWords(extractWords(''))));
    /**
     * AssertionError [ERR_ASSERTION]: Empty path
     */
    assert!((count_word instanceof Array), "Error!");
    for (let index = 0; index < count_word.length && index < 25; index++) {
        console.log(count_word[index]);
    }
}

main();