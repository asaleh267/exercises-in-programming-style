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
        let event_type = event[0];
        if (this.subscription[event_type] != undefined) {
            if (this.subscription[event_type] != "valid_word" && this.subscription[event_type] != "word") {
                for (let i = 0; i < this.subscription[event_type].length; i++) {
                    this.subscription[event_type][i](event);
                }
            }
            else {
                for (let i = 0; i < this.subscription[event_type].length; i++) {
                    this.subscription[event_type][0](event);
                }
            }
        }
    }
    unsubscribe(event_type, handler) {
        if (this.subscription[event_type].indexOf(handler) != -1)//if it's subscribed to a specific handler
            for (let i = 0; i < this.subscription[event_type].length; i++) {
                if (this.subscription[event_type][i] == handler) {
                    this.subscription[event_type].splice(i, 1);
                }
                break;
            }
    }
}

class DataStorage {
    eventManager;
    data;

    constructor(eventManager: EventMenager) {
        this.eventManager = eventManager;
        this.eventManager.subscribe('load', this.load.bind(this));
        console.log("Data Storage subscribed load");
        this.eventManager.subscribe('start', this.produceWords.bind(this));
        console.log("Data Storage subscribed start");
    }


    load(event) {
        let file_path = event[1];
        this.data = require('fs').readFileSync(file_path, 'utf8').toLowerCase().replace(/[\W_]+/g, " ");
        this.eventManager.unsubscribe('load', this.load.bind(this));
        console.log("Data Storae unsubscribed load");
    }

    produceWords(event) {
        let str = this.data.split(' ');
        let index = 0;
        for (index < str.length; index++;) {
            this.eventManager.publish(['word', str[index]]);
        }
        this.eventManager.publish(['word', str[index], "unsubscribe"]);
        this.eventManager.publish(['eof', null]);
        this.eventManager.unsubscribe('start', this.produceWords.bind(this));
        console.log("DataStorag unsubscribed from start");
    }

}

class StopWordFilter {
    eventManager;
    stopWords;

    constructor(eventManager) {
        this.stopWords = []
        this.eventManager = eventManager;
        this.eventManager.subscribe('load', this.load.bind(this));
        console.log("StopWordFilter subscribed load");
        this.eventManager.subscribe('word', this.isStopWord.bind(this));
        console.log("StopWordFilter subscribed to word");

    }

    load(event) {
        this.stopWords = require('fs').readFileSync('../data\\stop_words.txt', 'utf8').split(",");
        this.eventManager.unsubscribe('load', this.load.bind(this));
        console.log("StopWordFilter unsubscribed load");
    }

    isStopWord(event) {
        let word = event[1];
        if (this.stopWords.indexOf(word) == -1) {
            this.eventManager.publish(['valid_word', word]);
        }
        if (event[2] == "unsubscribe") {
            this.eventManager.publish(['valid_word', "unsubscribe"]);
            this.eventManager.unsubscribe('word', this.isStopWord.bind(this));
            console.log("StopWordFilter unsubscribed word");
        }
    }
}

class WordFrequencyCounter {
    eventManager;
    wordFreq: {};
    constructor(eventManager) {
        this.wordFreq = {};
        this.eventManager = eventManager;
        this.eventManager.subscribe('valid_word', this.incrementCount.bind(this));
        console.log("WordFreqCounter subscribed valid word")
        this.eventManager.subscribe('print', this.printFreq.bind(this));
        console.log("WordFreqCounter subscribed print")
    }
    incrementCount(event) {
        let word = event[1];
        if (word == "unsubscribe") {
            this.eventManager.unsubscribe('valid_word', this.incrementCount.bind(this));
            console.log("WordFreqCounter unsubscribed valid word");
        }
        if (this.wordFreq[word] != undefined) {
            this.wordFreq[word] += 1;
        } else {
            this.wordFreq[word] = 1;
        }
    }
    printFreq() {
        let arr = Object.entries(this.wordFreq).sort((a, b) => {
            return Number(b[1]) - Number(a[1]);
        });
        for (let index = 0; index < 25; index++) {
            console.log(arr[index]);
        }
        this.eventManager.unsubscribe('print', this.printFreq.bind(this));
        console.log("WordFreqCounter unsubscribed from print");
    }
}

class WordFrequencyApp {
    eventManager;
    constructor(eventManager) {
        this.eventManager = eventManager;
        this.eventManager.subscribe('run', this.run.bind(this));
        console.log("WordFrequencyApp subscribed run")
        this.eventManager.subscribe('eof', this.stop.bind(this));
        console.log("WordFrequencyApp subscribed eof")
    }
    run(event) {
        let file_path = event[1];
        this.eventManager.publish(['load', file_path]);
        this.eventManager.publish(['start', null]);
        this.eventManager.unsubscribe('run', this.run.bind(this));
        console.log("WordFrequencyApp unsubscribed run")
    }
    stop() {
        this.eventManager.publish(['print', null]);
        this.eventManager.unsubscribe('eof', this.stop.bind(this));
        console.log("WordFrequencyApp unsubscribed eof")
    }
}

let eventManager = new EventMenager();
new DataStorage(eventManager);
new StopWordFilter(eventManager);
new WordFrequencyCounter(eventManager);
new WordFrequencyApp(eventManager);

eventManager.publish(["run", "../data\\dummy_data.txt"]);