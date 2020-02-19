// This way using class 

import { write, readFile } from "fs";
class TFTheOne {  
    value;

    constructor(v) {
        this.value = v;
    }

    bind(func) {
        this.value = func(this.value);
        return this;
    }

    // print data
    printMe(data) {
        console.log(data.slice(0, 25))
    }

    // The functions
    // Takes a path to a file and returns the entire contents of the file as a string
    readFile(path: string) {
        return require('fs').readFileSync(path).toString().split("");
    }

    // Takes a string and returns a copy with all nonalphanumeric chars replaced by white space
    filterChars(data: any[]) {
        for (let index = 0; index < data.length; index++) {
            if (isLetter(data[index])) {
                data[index] = data[index].toLowerCase();
            } else {
                data[index] = '';
            }
        }
        return data;
    }

    // scan and remove stop words
    scan(data: string[]) {
        let word = "";
        let stopWords = require('fs').readFileSync("../data\\stop_words.txt").toString().split(",");
        let words = []

        for (let index = 0; index < data.length; index++) {
            if (isLetter(data[index]) && data[index] != "") {
                word += data[index];
            }
            else if (word != "" && !stopWords.includes(word)) {
                words.push(word);
                word = "";
            }
        }
        return words;
    }

    // Takes a list of words and returns a dictionary associating words with frequencies of occurrence
    frequancies(words: string[]) {
        let words_count: [string, number][] = [];
        for (let word in words) {
            let found = false
            for (var index = 0; index < words_count.length; index++) {
                if (words[word] == words_count[i][0]) {
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
    sort(words_count: [string, number][]) {
        words_count.sort((a, b) => {
            return b[1] - a[1];
        });
        return words_count;
    }
    
}

function isLetter(str: string): Boolean {
    return str.length === 1 && Boolean(str.match(/^[0-9a-zA-Z]+$/));
}

function main() {
    let item = new TFTheOne("../data\\dummy_data.txt");
    item.bind(item.readFile)
        .bind(item.filterChars)
        .bind(item.scan)
        .bind(item.frequancies)
        .bind(item.sort)
        .bind(item.printMe);
}

main();