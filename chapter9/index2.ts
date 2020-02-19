// This way using functions 

function wrap(v) {  
    //wrap takes a simple value and returns a function that, when called, returns the value
    return function () { return v };
}

function bind(value, func) {
    //bind takes a wrapped value and a function, and returns the result of calling that function on the application of the wrapped value.
    return func(value());
}

// The functions
// Takes a path to a file and returns the entire contents of the file as a string
function readFile(path: string) {
    return require('fs').readFileSync(path).toString().split("");
}

// Takes a string and returns a copy with all nonalphanumeric chars replaced by white space
function filterChars(data: any[]) {
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
function scan(data: string[]) {
    let word = "";
    let stopWords = require('fs').readFileSync("../data\\stop_words.txt").toString().split("\n");

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

// print data
function print(data) {
    console.log(data.slice(0, 25))

}

function isLetter(str: string): Boolean {
    return str.length === 1 && Boolean(str.match(/^[0-9a-zA-Z]+$/));
}

function main() {
    let readFileData = bind(wrap("../data\\dummy_data.txt"), readFile);
    let filterCharsData = bind(wrap(readFileData), filterChars);
    let scanData = bind(wrap(filterCharsData), scan);
    let frequanciesData = bind(wrap(scanData), frequancies);
    let sortData = bind(wrap(frequanciesData), sort);
    bind(wrap(sortData), print);
}

main();
