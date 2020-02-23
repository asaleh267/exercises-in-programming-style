class WordFrequencyFramework {
    loadEventHandlers: any[];
    doWorkEventHandlers: any[];
    endEventHandlers: any[];

    constructor() {
        this.loadEventHandlers = [];
        this.doWorkEventHandlers = [];
        this.endEventHandlers = [];
    }

    registerForLoadEvent(handler: any) {
        this.loadEventHandlers.push(handler);
    }
    registerForDoWorkEvent(handler: any) {
        this.doWorkEventHandlers.push(handler);
    }
    registerForEndEvent(handler: any) {
        this.endEventHandlers.push(handler);
    }

    run() {
        for (let index in this.loadEventHandlers) {
            this.loadEventHandlers[index]();
        }
        for (let index in this.doWorkEventHandlers) {
            console.log("work", this.doWorkEventHandlers[index]);
            this.doWorkEventHandlers[index]();
        }
        for (let index in this.endEventHandlers) {
            this.endEventHandlers[index]();
        }
    }
}

class DataStorage {
    data: string;
    stopWordFilter = undefined;
    wordEventHandler = [];

    constructor(wordFrequencyFramework: WordFrequencyFramework, stopWord) {
        this.stopWordFilter = stopWord;
        wordFrequencyFramework.registerForLoadEvent(this.read.bind(this));
        wordFrequencyFramework.registerForDoWorkEvent(this.words.bind(this));
    }

    read() {
        this.data = require('fs').readFileSync('../data\\dummy_data.txt').toString().replace(/[\W_|]+/gi, " ");
    }

    words() {
        let words = this.data.split(' ');
        for (let word in words) {
            if (!this.stopWordFilter.isStop(words[word])) {
                for (let h in this.wordEventHandler) {
                    this.wordEventHandler[h](words[word])
                }
            }
        }
    }
    registerWordHandler(handler) {
        this.wordEventHandler.push(handler)
    }
}

class StopWords {
    stopWordsList: [];
    constructor(wordFrequencyFramework: WordFrequencyFramework) {
        this.stopWordsList = [];
        wordFrequencyFramework.registerForLoadEvent(this.readStop.bind(this));
    }
    readStop() {
        this.stopWordsList = require('fs').readFileSync('../data\\stop_words.txt').toString().split("\n");
    }
    isStop(word: string): Boolean {
        for (let index in this.stopWordsList) {
            if (this.stopWordsList[index] == word)
                return true;
        }
        return false;
    }
}

class FreqCount {
    freq: [string, number][];
    constructor(wordFrequencyFramework: WordFrequencyFramework, dataStorage: DataStorage) {
        this.freq = [];
        dataStorage.registerWordHandler(this.increment.bind(this));
        wordFrequencyFramework.registerForEndEvent(this.sort.bind(this));
        wordFrequencyFramework.registerForEndEvent(this.print.bind(this));
    }
    
    increment(word: string) {
        let found;
        for (let index in this.freq) {
            found = false;
            if (this.freq[index][0] == word) {
                this.freq[index][1] += 1;
                found = true;
                break;
            }
        }
        if (!found) {
            this.freq.push([word, 1]);
        }
    }
    sort() {
        this.freq = this.freq.sort((a, b) => { 
            return b[1] - a[1];
        });
    }
    print() {
        console.log("Result, \n", this.freq.slice(0, 25));
    }
}

let wordFrequencyInstance = new WordFrequencyFramework();
let stopWordsInstance = new StopWords(wordFrequencyInstance)
let data = new DataStorage(wordFrequencyInstance, stopWordsInstance)
let freq = new FreqCount(wordFrequencyInstance, data)
wordFrequencyInstance.run();