import { NONAME } from "dns";
import { isMainThread } from "worker_threads";


enum MESSAGE {
    init,
    words,
    isStopWord,
    countWord,
    sorted,
    run
}

class DataStorageManager {
    data: string;

    dispatch(message) {
        if (message[0] == MESSAGE.init) {
            return this.init(message[1]);
        }
        else if (message[0] == MESSAGE.words) {
            return this.words();
        } else {
            throw new Error("Message not understood " + message[0]);
        }
    }

    init(path: string) {
        this.data = require('fs').readFileSync(path).toString();
        this.data = this.data.replace(/[\W_|]+/gi, " ");
    }

    words() {
        return this.data.split(" ");
    }
}

class StopWordsManager {
    stopWords: string[];

    dispatch(message) {
        if (message[0] == MESSAGE.init) {
            return this.init(message[1]);
        } else if (message[0] == MESSAGE.isStopWord) {
            return this.isStopWord(message[1]);
        } else {
            throw new Error("Message not understood " + message[0]);
        }
    }

    init(path: string) {
        this.stopWords = require('fs').readFileSync(path).toString().split(",");
    }

    isStopWord(word: string) {
        return this.stopWords.includes(word);
    }
}

class FrequancyManaer {
    wordFreq: [string, number][];

    constructor() {
        this.wordFreq = []
    }

    dispatch(message) {
        if (message[0] == MESSAGE.countWord) {
            return this.countWord(message[1]);
        }  else if (message[0] == MESSAGE.sorted) {
            return this.sorted();
        } else {
            throw new Error("Message not understood " + message[0]);
        }
    }

    countWord(word: string) {
        let found = false;

        for (let index = 0; index < this.wordFreq.length; index++)
            if (word == this.wordFreq[index][0]) {
                this.wordFreq[index][1] += 1;
                found = true
            }

        if (!found) this.wordFreq.push([word, 1]);
    }

    sorted() {
        return this.wordFreq.sort((a, b) => {
            return b[1] - a[1];
        });
    }
}


class WordFrequancyController {

    storageManager;
    stopWordsManager;
    frequancyManager;

    dispatch(message) {
        if (message[0] == MESSAGE.init) {
            return this.init();
        } else if (message[0] == MESSAGE.run) {
            return this.run();
        } else {
            throw new Error("Message not understood " + message[0]);
        }
    }


    init() {
        this.storageManager = new DataStorageManager()
        this.storageManager.dispatch([MESSAGE.init, "../data\\dummy_data.txt"]);

        this.stopWordsManager = new StopWordsManager();
        this.stopWordsManager.dispatch([MESSAGE.init, "../data\\stop_words.txt"]);

        this.frequancyManager = new FrequancyManaer();
    }
    run() {
        var words = this.storageManager.dispatch([MESSAGE.words]);

        for (let word in words) {
            if (!this.stopWordsManager.dispatch([MESSAGE.isStopWord, words[word]])) {
                this.frequancyManager.dispatch([MESSAGE.countWord, words[word]])
            }
        }
        console.log(this.frequancyManager.dispatch([MESSAGE.sorted]).slice(0, 25));
    }
}

function main() {
    let wordFreq = new WordFrequancyController();
    wordFreq.dispatch([MESSAGE.init]);
    wordFreq.dispatch([MESSAGE.run]);
}
main();