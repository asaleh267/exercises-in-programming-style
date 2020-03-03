const fs = require("fs");
const _ = require("lodash");
const { Queue } = require('queue-typescript');

let wordSpace = new Queue();
let freqSpace = new Queue();

let data = fs.readFileSync("../data\\dummy_data.txt", "utf8").toLowerCase().replace(/[\W_]+/g, " ").split(" ");
let stopWords = fs.readFileSync('../data\\stop_words.txt', 'utf8').split(",");
let workers = [];
let count = 4;

function processWord(threadNumber, resolve) {
    let word_freq = {}
    let word;
    var id = setInterval(() => {
        if (wordSpace.length == 0) {
            freqSpace.enqueue(word_freq);
            resolve();
            clearInterval(id);
        };
        word = wordSpace.dequeue()//we used setTimout here and it didn't work 

        if (word !== undefined && stopWords.indexOf(word) == -1) {
            if (word_freq[word] == undefined) {
                word_freq[word] = 1;
            } else {
                word_freq[word] += 1;
            }
        }
    }, count - threadNumber)

}

async function main() {

    //push all words
    for (let index = 0; index < data.length; index++) {
        wordSpace.enqueue(data[index])
    }

    for (let index = 0; index < 4; index++) {
        workers.push(new Promise(function (resolve, reject) {
            processWord(index, resolve)//we also used setTimeout here 
        }))

    }
    //wait all threads to end
    await Promise.all(workers);
    let word_freq = {}
    let freqs;
    let keys = [];
    let count = 0;

    while (freqSpace.length != 0) {
        freqs = freqSpace.dequeue();
        keys = Object.keys(freqs)
        for (let index = 0; index < keys.length; index++) {
            if (word_freq[keys[index]] == undefined)
                count = freqs[keys[index]]
            else count = word_freq[keys[index]] + freqs[keys[index]]
            word_freq[keys[index]] = count
        }
    }
    let arr = Object.entries(_.fromPairs(_.sortBy(_.toPairs(word_freq), 1).reverse()))
    for (let index = 0; index < 25; index++) {
        console.log(arr[index])
    }
}

main();