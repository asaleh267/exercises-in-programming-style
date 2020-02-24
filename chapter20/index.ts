let fs = require('fs');

function extractWords(path: string) {
    if (path == "") {
        return [];
    }
    try {
        return fs.readFileSync(path).toString().replace(/[\W_|]+/gi, " ").split(" ");
    } catch{
        console.log("Error in opening the file");
        return [];
    }
}

function removeStopWord(words: string[]) {
    if (words == [])
        return [];
    let stopwords;
    try {
        stopwords = fs.readFileSync('../data\\stop_words.txt').toString().split(",");
    } catch{
        console.log("error opening the stop words file")
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
    if (words == []) {
        return [];
    }

    let words_count: [string, number][] = [];

    for (let word in words) {
        let found = false;
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

function main() {
    let count_word = sort(frequancies(removeStopWord(extractWords('../data\\dummy_data.txt'))));
    if (count_word instanceof Array) {
        for (let i = 0; i < count_word.length && i < 25; i++) {
            console.log(count_word[i]);
        }
    } else {
        console.log("Error!");
    }
}

main();