import { NONAME } from "dns";

class EventMenager {
    subscription: {};

    constructor() {
        this.subscription = {};
    }

    subscribe(eventType, handler) {
        if (this.subscription[eventType] == undefined) {
            this.subscription[eventType] = [handler];
        } else {
            this.subscription[eventType].push(handler);
        }
    }

    publish(event: string[]) {
        let eventType = event[0];
        if (this.subscription[eventType] != undefined) {
            for (let index = 0; index < this.subscription[eventType].length; index++) {
                this.subscription[eventType][index](event);
            }
        }
    }
}

class DataStorage {
    eventManager;
    data;

    constructor(eventManager: EventMenager) {
        this.eventManager = eventManager;
        this.eventManager.subscribe('load', this.load.bind(this));
        this.eventManager.subscribe('start', this.produceWords.bind(this));
    }

    load(event) {
        let file_path = event[1];
        this.data = require('fs').readFileSync(file_path, 'utf8').toLowerCase().replace(/[\W_]+/g, " ");
    }

    produceWords(event) {
        let str = this.data.split(' ');
        for (let index = 0; index < str.length; index++) {
            this.eventManager.publish(['word', str[index]]);
        }
        this.eventManager.publish(['eof', null]);
    }

}

class StopWordFilter {
    eventManager;
    stopWords;

    constructor(eventManager) {
        this.stopWords = []
        this.eventManager = eventManager;
        this.eventManager.subscribe('load', this.load.bind(this));
        this.eventManager.subscribe('word', this.isStopWord.bind(this));
    }

    load(event) {
        this.stopWords = require('fs').readFileSync('../data\\stop_words.txt', 'utf8').split(",");
    }

    isStopWord(event) {
        let word = event[1];
        if (this.stopWords.indexOf(word) == -1) {
            this.eventManager.publish(['valid_word', word]);
        }
    }
}

class WordFrequencyCounter {
    eventManager;
    wordFreq: {};
    top25: [string, any][];
    constructor(eventManager) {
        this.wordFreq = {};
        this.eventManager = eventManager;
        this.top25 = [];
        this.eventManager.subscribe('valid_word', this.incrementCount.bind(this));
        this.eventManager.subscribe('print', this.printFreq.bind(this));
    }
    incrementCount(event) {
        let word = event[1];
        if (this.wordFreq[word] != undefined) {
            this.wordFreq[word] += 1;
        } else {
            this.wordFreq[word] = 1;
        }
    }
    printFreq() {
        let arr = Object.entries(this.wordFreq).sort((a, b) => {
            return b[1] - a[1];
        });
        for (let index = 0; index < 25; index++) {
            this.top25.push(arr[index]);
        }
        console.log(this.top25);
    }
}

class WordsWithZ {
    eventManager;
    dataStorage;
    wordFrequencyCounter;
    wordsWithZ: [string: number][];
    constructor(event_manager, dataStorage, wordFrequencyCounter) {
        this.dataStorage = dataStorage
        this.wordFrequencyCounter = wordFrequencyCounter;
        this.wordsWithZ = [];
        this.eventManager = event_manager;
        this.eventManager.subscribe('print', this.printWordsWithZ.bind(this))
    }
    printWordsWithZ(event) {
        let top25Words = this.wordFrequencyCounter.top25;
        for (let index = 0; index < top25Words.length; index++) {
            if (top25Words[index][0].indexOf('z') !== -1) {
                this.wordsWithZ.push(top25Words[index]);
            }
        }
        if (this.wordsWithZ.length === 0) {
            console.log('no words with z');
        } else {
            console.log('Words with z');
            console.log(this.wordsWithZ);
        }
    }
}

class WordFrequencyApp {
    eventManager;
    constructor(eventManager) {
        this.eventManager = eventManager;
        this.eventManager.subscribe('run', this.run.bind(this));
        this.eventManager.subscribe('eof', this.stop.bind(this));
    }
    run(event) {
        let file_path = event[1];
        this.eventManager.publish(['load', file_path]);
        this.eventManager.publish(['start', null]);
    }
    stop() {
        this.eventManager.publish(['print', null]);
    }
}

let eventManager = new EventMenager();
let dataStorage = new DataStorage(eventManager);
let stopWordFilter = new StopWordFilter(eventManager);
let wordFrequencyCounter = new WordFrequencyCounter(eventManager);
let app = new WordFrequencyApp(eventManager);
let wordsWithZ = new WordsWithZ(eventManager, dataStorage, wordFrequencyCounter);

eventManager.publish(["run", "../data\\dummy_data.txt"]);

