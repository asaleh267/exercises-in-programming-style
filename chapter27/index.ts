import { isMainThread } from "worker_threads";

// function generator for charachters in path text
function* characters(path: string) {
    //console.log('characters');
    let characters = require("fs").readFileSync(path).toString();
    for (let c in characters) {
        yield characters[c];
    }
}

// function generator to get all words 
function* allWords(path: string) {
    //console.log('all words');

    let start_char = true;
    let word = "";
    let generator = characters(path);
    let character = generator.next().value;
    while (character != undefined) {
        if (start_char) {
            word = "";
            if (isLetter(character)) {
                word += character;
                start_char = false;
            }
        } else if (!isLetter(character)) {
            start_char = true;
            yield word.toLowerCase();
        } else {
            word += character;
        }
        character = generator.next().value;
        //console.log(character);
    }
}

function* nonStopWords(path: string) {
    //console.log('none stop');

    let stopWords = require("fs").readFileSync("../data\\stop_words.txt").toString().split(',');
    let generator = allWords(path);
    let word = generator.next().value
    while (word != undefined) {
        if (!stopWords.includes(word)) {
            yield word;
        }
        word = generator.next().value;
    }
}

function countAndScan(path: string) {
    let freq = {};
    let generator = nonStopWords(path);
    let word = generator.next().value;
    while (word) {
        if (word in freq) {
            freq[word] += 1;
        } else
            freq[word] = 1;
        word = generator.next().value;
    }
    var items = Object.keys(freq).map(function (key) {
        return [key, freq[key]];
    });
    items.sort((a, b) => {
        return b[1] - a[1];
    });
    return items;
}

function isLetter(str: string): Boolean {
    return str.length === 1 && Boolean(str.match(/^[0-9a-zA-Z]+$/));
}

function main() {
    //console.log('main');
    console.log(countAndScan("../data\\dummy_data.txt").slice(0, 25));
}

main();