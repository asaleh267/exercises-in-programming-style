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
        this.data = fs.readFileSync(file_path, 'utf8').toLowerCase().replace(/[\W_]+/g, " ");
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
        this.stopWords = fs.readFileSync('../data\\stop_words.txt', 'utf8').split(",");
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
    constructor(eventManager) {
        this.wordFreq = {};
        this.eventManager = eventManager;
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
            console.log(arr[index]);
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
new DataStorage(eventManager);
new StopWordFilter(eventManager);
new WordFrequencyCounter(eventManager);
new WordFrequencyApp(eventManager);

eventManager.publish(["run", "../data\\dummy_data.txt"]);